// ** Mock Adapter
import mock from 'src/@fake-db/mock'
import axios from 'axios'

const previousDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
const dayBeforePreviousDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 2)

const data = {
  profileUser: {
    id: 11,
    avatar: '/images/avatars/1.png',
    fullName: 'John Doe',
    role: 'admin',
    about:
      'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
    status: 'online',
    settings: {
      isTwoStepAuthVerificationEnabled: true,
      isNotificationsOn: false
    }
  },
  contacts: [
    {
      id: 1,
      fullName: 'Janita',
      role: '',
      about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
      avatar: '/images/avatars/2.png',
      status: 'offline'
    }
  ],
  chats: [
    {
      id: 1,
      userId: 1,
      unseenMsgs: 1,
      chat: [
        {
          message: "How can we help? We're here for you!",
          time: 'Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)',
          senderId: 11,
          feedback: {
            isSent: true,
            isDelivered: true,
            isSeen: true
          }
        }
      ]
    }
  ]
}

const reorderChats = (arr, from, to) => {
  const item = arr.splice(from, 1)

  // ** Move the item to its new position
  arr.splice(to, 0, item[0])
}

// ------------------------------------------------
// GET: Return Chats Contacts and Contacts
// ------------------------------------------------
mock.onGet('/apps/chat/chats-and-contacts').reply(() => {
  const chatsContacts = data.chats.map(chat => {
    const contact = data.contacts.find(c => c.id === chat.userId)

    // @ts-ignore
    contact.chat = { id: chat.id, unseenMsgs: chat.unseenMsgs, lastMessage: chat.chat[chat.chat.length - 1] }

    return contact
  })

  const contactsToShow = data.contacts.filter(co => {
    return !data.chats.some(ch => {
      return co.id === ch.id
    })
  })

  const profileUserData = {
    id: data.profileUser.id,
    avatar: data.profileUser.avatar,
    fullName: data.profileUser.fullName,
    status: data.profileUser.status
  }

  return [200, { chatsContacts, contacts: contactsToShow, profileUser: profileUserData }]
})

// ------------------------------------------------
// GET: Return User Profile
// ------------------------------------------------
mock.onGet('/apps/chat/users/profile-user').reply(() => [200, data.profileUser])

// ------------------------------------------------
// GET: Return Single Chat
// ------------------------------------------------
mock.onGet('/apps/chat/get-chat').reply(config => {
  // Get event id from URL
  let userId = config.params.id

  //  Convert Id to number
  userId = Number(userId)
  const chat = data.chats.find(c => c.id === userId)
  if (chat) chat.unseenMsgs = 0
  const contact = data.contacts.find(c => c.id === userId)

  // @ts-ignore
  if (contact.chat) contact.chat.unseenMsgs = 0

  return [200, { chat, contact }]
})

const SendMsgToChatGPT = async obj => {
  let activeChat = data.chats.find(chat => chat.id === obj.contact.id)

  const apiUrl = 'https://api.openai.com/v1/chat/completions' // URL de la API de ChatGPT
  const apiKey = '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' // Tu clave de API de OpenAI

  let chats = []
  console.log('activeChat')
  console.log(activeChat.chat)

  for await (const i of activeChat.chat) {
    chats.push({
      role: i.senderId == 1 ? 'assistant' : 'user',
      content: i.message
    })
  }

  console.log(chats)

  const responseApi = await axios.post(
    apiUrl,
    {
      messages: chats,
      model: 'gpt-3.5-turbo'
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      }
    }
  )
  console.log(responseApi.data.choices[0].message)
  responseApi.data.choices[0].message

  const chatResponse = responseApi.data.choices[0].message.content

  const newMessageData = {
    senderId: 1,
    time: new Date(),
    message: chatResponse,
    feedback: {
      isSent: true,
      isSeen: false,
      isDelivered: false
    }
  }

  // If there's new chat for user create one
  let isNewChat = false
  if (activeChat === undefined) {
    isNewChat = true
    data.chats.push({
      id: obj.contact.id,
      userId: obj.contact.id,
      unseenMsgs: 0,
      chat: [newMessageData]
    })
    activeChat = data.chats[data.chats.length - 1]
  } else {
    activeChat.chat.push(newMessageData)
  }
  const response = { newMessageData, id: obj.contact.id }

  // @ts-ignore
  if (isNewChat) response.chat = activeChat
  reorderChats(
    data.chats,
    data.chats.findIndex(i => i.id === response.id),
    0
  )
}

// ------------------------------------------------

// POST: Add new chat message
// ------------------------------------------------
mock.onPost('/apps/chat/send-msg').reply(async config => {
  // Get event from post data
  const { obj } = JSON.parse(config.data).data
  let activeChat = data.chats.find(chat => chat.id === obj.contact.id)

  const newMessageData = {
    senderId: 11,
    time: new Date(),
    message: obj.message,
    feedback: {
      isSent: true,
      isSeen: false,
      isDelivered: false
    }
  }

  // If there's new chat for user create one
  let isNewChat = false
  if (activeChat === undefined) {
    isNewChat = true
    data.chats.push({
      id: obj.contact.id,
      userId: obj.contact.id,
      unseenMsgs: 0,
      chat: [newMessageData]
    })
    activeChat = data.chats[data.chats.length - 1]
  } else {
    activeChat.chat.push(newMessageData)
  }
  const response = { newMessageData, id: obj.contact.id }

  // @ts-ignore
  if (isNewChat) response.chat = activeChat
  reorderChats(
    data.chats,
    data.chats.findIndex(i => i.id === response.id),
    0
  )

  await SendMsgToChatGPT(obj)

  return [201, { response }]
})
