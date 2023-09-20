// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'

import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteUser } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  company: yup.string().required(),
  billing: yup.string().required(),
  country: yup.string().required(),
  email: yup.string().email().required(),
  contact: yup
    .number()
    .typeError('Contact Number field is required')
    .min(10, obj => showErrors('Contact Number', obj.value.length, obj.min))
    .required(),
  fullName: yup
    .string()
    .min(3, obj => showErrors('First Name', obj.value.length, obj.min))
    .required(),
  username: yup
    .string()
    .min(3, obj => showErrors('Username', obj.value.length, obj.min))
    .required()
})

const defaultValues = {
  email: '',
  company: '',
  country: '',
  billing: '',
  fullName: '',
  username: '',
  contact: Number('')
}

const UserList = props => {
  // ** Props
  const { open, toggle } = props

  // ** State
  const [plan, setPlan] = useState('basic')
  const [role, setRole] = useState('subscriber')

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

  const [data, setData] = useState([])

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get('http://54.148.92.78:3000/pacientes')
      const apiData = res.data
      setData(res.data.data)
      console.log(apiData)
    }

    getData()
  }, [])

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)

  const onSubmit = data => {
    console.log('enviando datos:')
    console.log(data)

    const res2 = axios.post('http://54.148.92.78:3000/pacientes')

    /*
    if (store.allData.some(u => u.email === data.email || u.username === data.username)) {
      store.allData.forEach(u => {
        if (u.email === data.email) {
          setError('email', {
            message: 'Email already exists!'
          })
        }
        if (u.username === data.username) {
          setError('username', {
            message: 'Username already exists!'
          })
        }
      })
    } else {
      dispatch(addUser({ ...data, role, currentPlan: plan }))
      toggle()
      reset()
    }
    */
  }

  const handleClose = () => {
    setPlan('basic')
    setRole('subscriber')
    setValue('contact', Number(''))
    toggle()
    reset()
  }

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <Divider sx={{ m: '0 !important' }} />

          {/*<TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />*/}

          <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name='fullName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Full Name'
                    onChange={onChange}
                    placeholder='John Doe'
                    error={Boolean(errors.fullName)}
                    {...(errors.fullName && { helperText: errors.fullName.message })}
                  />
                )}
              />
              <Controller
                name='username'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Username'
                    onChange={onChange}
                    placeholder='johndoe'
                    error={Boolean(errors.username)}
                    {...(errors.username && { helperText: errors.username.message })}
                  />
                )}
              />
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type='email'
                    label='Email'
                    value={value}
                    sx={{ mb: 4 }}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder='johndoe@email.com'
                    {...(errors.email && { helperText: errors.email.message })}
                  />
                )}
              />
              <Controller
                name='company'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Company'
                    onChange={onChange}
                    placeholder='Company PVT LTD'
                    error={Boolean(errors.company)}
                    {...(errors.company && { helperText: errors.company.message })}
                  />
                )}
              />
              <Controller
                name='country'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Country'
                    onChange={onChange}
                    placeholder='Australia'
                    error={Boolean(errors.country)}
                    {...(errors.country && { helperText: errors.country.message })}
                  />
                )}
              />
              <Controller
                name='contact'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type='number'
                    value={value}
                    sx={{ mb: 4 }}
                    label='Contact'
                    onChange={onChange}
                    placeholder='(397) 294-5153'
                    error={Boolean(errors.contact)}
                    {...(errors.contact && { helperText: errors.contact.message })}
                  />
                )}
              />
              <Controller
                name='billing'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    sx={{ mb: 4 }}
                    label='Billing'
                    id='validation-billing-select'
                    error={Boolean(errors.billing)}
                    aria-describedby='validation-billing-select'
                    {...(errors.billing && { helperText: errors.billing.message })}
                    SelectProps={{ value: value, onChange: e => onChange(e) }}
                  >
                    <MenuItem value=''>Billing</MenuItem>
                    <MenuItem value='Auto Debit'>Auto Debit</MenuItem>
                    <MenuItem value='Manual - Cash'>Manual - Cash</MenuItem>
                    <MenuItem value='Manual - Paypal'>Manual - Paypal</MenuItem>
                    <MenuItem value='Manual - Credit Card'>Manual - Credit Card</MenuItem>
                  </CustomTextField>
                )}
              />
              <CustomTextField
                select
                fullWidth
                value={role}
                sx={{ mb: 4 }}
                label='Select Role'
                onChange={e => setRole(e.target.value)}
                SelectProps={{ value: role, onChange: e => setRole(e.target.value) }}
              >
                <MenuItem value='admin'>Admin</MenuItem>
                <MenuItem value='author'>Author</MenuItem>
                <MenuItem value='editor'>Editor</MenuItem>
                <MenuItem value='maintainer'>Maintainer</MenuItem>
                <MenuItem value='subscriber'>Subscriber</MenuItem>
              </CustomTextField>

              <CustomTextField
                select
                fullWidth
                sx={{ mb: 6 }}
                label='Select Plan'
                SelectProps={{ value: plan, onChange: e => setPlan(e.target.value) }}
              >
                <MenuItem value='basic'>Basic</MenuItem>
                <MenuItem value='company'>Company</MenuItem>
                <MenuItem value='enterprise'>Enterprise</MenuItem>
                <MenuItem value='team'>Team</MenuItem>
              </CustomTextField>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button type='submit' variant='contained' sx={{ mr: 3 }}>
                  Submit
                </Button>
                <Button variant='tonal' color='secondary' onClick={handleClose}>
                  Cancel
                </Button>
              </Box>
            </form>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

export const getStaticProps = async () => {
  // const res = await axios.get('/cards/statistics')

  const res2 = await axios.get('http://54.148.92.78:3000/pacientes')
  const apiData = res2.data

  return {
    props: {
      apiData
    }
  }
}

export default UserList
