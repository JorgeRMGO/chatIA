// ** React Imports
import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import LinearProgress from '@mui/material/LinearProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import { useSettings } from 'src/@core/hooks/useSettings'
import useMediaQuery from '@mui/material/useMediaQuery'
import { sendMsg, selectChat, fetchUserProfile, fetchChatsContacts, removeSelectedChat } from 'src/store/apps/chat'
import SidebarLeft from 'src/views/apps/chat/SidebarLeft'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'
import UserSuspendDialog from 'src/views/apps/user/view/UserSuspendDialog'
import UserSubscriptionDialog from 'src/views/apps/user/view/UserSubscriptionDialog'
import * as yup from 'yup'
import ChatContent from 'src/views/apps/chat/ChatContent'
import { formatDateToMonthShort } from 'src/@core/utils/format'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const roleColors = {
  admin: 'error',
  editor: 'info',
  author: 'warning',
  maintainer: 'success',
  subscriber: 'primary'
}

const defaultValues = {
  nombre: '',
  apellidos: '',
  edad: '',
  sexo: '',
  telefono: '',
  email: '',
  direccion: '',
  contacto: ''
}

const schema = yup.object().shape({
  nombre: yup
    .string()
    .typeError('El nombre es requerido')
    .min(3, obj => showErrors('Nombre', obj.value.length, obj.min))
    .required(),
  apellidos: yup
    .string()
    .min(3, obj => showErrors('Apellidos', obj.value.length, obj.min))
    .required(),
  edad: yup
    .number()
    .typeError('La edad es requerida')
    .min(10, obj => showErrors('Edad Numerica', obj.value.length, obj.min))
    .required(),
  telefono: yup
    .number()
    .typeError('Numero de telefono es requerido')
    .min(10, obj => showErrors('Telefono Numerico', obj.value.length, obj.min))
    .required(),
  direccion: yup
    .string()
    .typeError('Dirección es requerido')
    .min(3, obj => showErrors('Direccion', obj.value.length, obj.min))
    .required()
})

const statusColors = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

const data = {
  data: {
    _id: '650c7dd0d39738c31123ddd0',
    id: null,
    nombre: 'JORGE',
    apellidos: 'MURILLO',
    edad: 24,
    sexo: 'Masculino',
    telefono: 4434797316,
    email: 'jorge@gmail.com',
    direccion: 'ANGAMACUTIRO',
    contacto: '6656200'
  }
}

// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
  top: 0,
  left: -10,
  position: 'absolute',
  color: theme.palette.primary.main
}))

// ** Styled <sub> component
const Sub = styled('sub')(({ theme }) => ({
  alignSelf: 'flex-end',
  color: theme.palette.text.disabled,
  fontSize: theme.typography.body1.fontSize
}))

const UserViewLeft = () => {
  // ** States
  const [openEdit, setOpenEdit] = useState(false)
  const [openPlans, setOpenPlans] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false)
  const theme = useTheme()
  const { settings } = useSettings()
  const dispatch = useDispatch()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))
  const store = useSelector(state => state.chat)
  const [userProfileRightOpen, setUserProfileRightOpen] = useState(false)
  const [userStatus, setUserStatus] = useState('online')
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [userProfileLeftOpen, setUserProfileLeftOpen] = useState(false)

  // ** Vars
  const { skin } = settings
  const smAbove = useMediaQuery(theme.breakpoints.up('sm'))
  const sidebarWidth = smAbove ? 360 : 300
  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))

  const statusObj = {
    busy: 'error',
    away: 'warning',
    online: 'success',
    offline: 'secondary'
  }

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    axios
      .post('http://54.148.92.78:3000/pacientes', data)
      .then(function (response) {
        reset()
        toast.success('Paciente Registrado!')
      })
      .catch(function (error) {
        toast.error('Error al registrar paciente')
      })
  }

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)
  const handleUserProfileRightSidebarToggle = () => setUserProfileRightOpen(!userProfileRightOpen)
  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)
  const handleUserProfileLeftSidebarToggle = () => setUserProfileLeftOpen(!userProfileLeftOpen)

  // Handle Upgrade Plan dialog
  const handlePlansClickOpen = () => setOpenPlans(true)
  const handlePlansClose = () => setOpenPlans(false)
  if (data) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent sx={{ pt: 13.5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                {data.avatar ? (
                  <CustomAvatar
                    src={data.avatar}
                    variant='rounded'
                    alt={data.data.nombre}
                    sx={{ width: 100, height: 100, mb: 4 }}
                  />
                ) : (
                  <CustomAvatar
                    skin='light'
                    variant='rounded'
                    color={data.avatarColor}
                    sx={{ width: 100, height: 100, mb: 4, fontSize: '3rem' }}
                  >
                    {getInitials(data.data.nombre + ' ' + data.data.apellidos)}
                  </CustomAvatar>
                )}
                <Typography variant='h4' sx={{ mb: 3 }}>
                  {data.data.nombre + ' ' + data.data.apellidos}
                </Typography>
                <CustomChip
                  rounded
                  skin='light'
                  size='small'
                  label={data.data.edad}
                  color={roleColors[data.role]}
                  sx={{ textTransform: 'capitalize' }}
                />
              </CardContent>
              <Divider sx={{ my: '0 !important', mx: 6 }} />
              <CardContent sx={{ pb: 4 }}>
                <Box sx={{ pt: 4 }}>
                  <Grid item xs={12}>
                    <Controller
                      name='nombre'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          sx={{ mb: 4 }}
                          label='Ritmo Cardiaco'
                          onChange={onChange}
                          placeholder='Ingresar'
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <Icon fontSize='1.25rem' icon='ion:heart-sharp' />
                              </InputAdornment>
                            )
                          }}
                          error={Boolean(errors.nombre)}
                          {...(errors.nombre && { helperText: errors.nombre.message })}
                        />
                      )}
                    />
                  </Grid>
                </Box>
              </CardContent>

              <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button type='submit' variant='contained' sx={{ mr: 3 }}>
                  Guardar
                </Button>
                <a href='../'>
                  <Button variant='tonal' color='secondary'>
                    Cancelar
                  </Button>
                </a>
              </CardActions>
            </form>
          </Card>
        </Grid>
        <Grid item xs={8}>
          <Card>
            <CardContent sx={{ pb: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <CustomChip rounded skin='light' size='small' color='primary' label='Chat' />
              <Box sx={{ display: 'flex', position: 'relative' }}></Box>
            </CardContent>
            <CardContent>
              <Box sx={{ mt: 2.5, mb: 4 }}>
                <SidebarLeft
                  store={store}
                  hidden={hidden}
                  mdAbove={mdAbove}
                  dispatch={dispatch}
                  statusObj={statusObj}
                  userStatus={userStatus}
                  selectChat={selectChat}
                  getInitials={getInitials}
                  sidebarWidth={sidebarWidth}
                  setUserStatus={setUserStatus}
                  leftSidebarOpen={leftSidebarOpen}
                  removeSelectedChat={removeSelectedChat}
                  userProfileLeftOpen={userProfileLeftOpen}
                  formatDateToMonthShort={formatDateToMonthShort}
                  handleLeftSidebarToggle={handleLeftSidebarToggle}
                  handleUserProfileLeftSidebarToggle={handleUserProfileLeftSidebarToggle}
                />
                <ChatContent
                  store={store}
                  hidden={hidden}
                  sendMsg={sendMsg}
                  mdAbove={mdAbove}
                  dispatch={dispatch}
                  statusObj={statusObj}
                  getInitials={getInitials}
                  sidebarWidth={sidebarWidth}
                  userProfileRightOpen={userProfileRightOpen}
                  handleLeftSidebarToggle={handleLeftSidebarToggle}
                  handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}
UserViewLeft.contentHeightFixed = true

export default UserViewLeft
