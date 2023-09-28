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
import InputAdornment from '@mui/material/InputAdornment'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteUser } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import toast from 'react-hot-toast'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `Campo requerido`
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
  nombre: yup
    .string()
    .typeError('')
    .min(3, obj => showErrors('', obj.value.length, obj.min))
    .required(),
  apellidos: yup
    .string()
    .min(3, obj => showErrors('', obj.value.length, obj.min))
    .required(),
  edad: yup
    .number()
    .typeError('Campo requerido')
    .min(10, obj => showErrors('Campo requerido', obj.value.length, obj.min))
    .required(),
  telefono: yup
    .number()
    .typeError('Campo requerido')
    .min(10, obj => showErrors('Campo requerido', obj.value.length, obj.min))
    .required(),
  direccion: yup
    .string()
    .typeError('')
    .min(3, obj => showErrors('', obj.value.length, obj.min))
    .required(),
  sexo: yup.string().required()
})

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

  const ToastSuccess = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          '& svg': { mb: 2 }
        }}
      >
        <Icon icon='tabler:circle-check' fontSize='2rem' />
        <Typography sx={{ mb: 4, fontWeight: 600 }}>Success</Typography>
        <Typography sx={{ mb: 3 }}>Paciente Registrado</Typography>
      </Box>
    )
  }

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get('http://54.148.92.78:3000/api/pacientes')
      const apiData = res.data
      setData(res.data.data)
    }

    getData()
  }, [])

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)

  const onSubmit = data => {
    axios
      .post('http://54.148.92.78:3000/api/pacientes', data)
      .then(function (response) {
        reset()
        toast.success('Paciente Registrado!')
      })
      .catch(function (error) {
        toast.error('Error al registrar paciente')
      })
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
          <CardHeader title='Registro de paciente' />
          {/* <Divider sx={{ m: '0 !important' }} /> */}

          {/*<TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />*/}

          <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={6.5}>
                <Grid item xs={4}>
                  <Controller
                    name='nombre'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label='Nombre'
                        onChange={onChange}
                        placeholder='Ingresar'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Icon fontSize='1.25rem' icon='tabler:user' />
                            </InputAdornment>
                          )
                        }}
                        error={Boolean(errors.nombre)}
                        {...(errors.nombre && { helperText: errors.nombre.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Controller
                    name='apellidos'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label='Apellidos'
                        onChange={onChange}
                        placeholder='Ingresar'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Icon fontSize='1.25rem' icon='tabler:user' />
                            </InputAdornment>
                          )
                        }}
                        error={Boolean(errors.apellidos)}
                        {...(errors.apellidos && { helperText: errors.apellidos.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Controller
                    name='edad'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label='Edad'
                        type='number'
                        onChange={onChange}
                        placeholder='Ingresar'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Icon fontSize='1.25rem' icon='tabler:user' />
                            </InputAdornment>
                          )
                        }}
                        error={Boolean(errors.edad)}
                        {...(errors.edad && { helperText: errors.edad.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Controller
                    name='sexo'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        select
                        fullWidth
                        sx={{ mb: 4 }}
                        label='Sexo'
                        id='validation-billing-select'
                        error={Boolean(errors.sexo)}
                        aria-describedby='validation-billing-select'
                        {...(errors.sexo && { helperText: errors.sexo.message })}
                        SelectProps={{ value: value, onChange: e => onChange(e) }}
                      >
                        <MenuItem value=''>Seleccione...</MenuItem>
                        <MenuItem value='Femenino'>Femenino</MenuItem>
                        <MenuItem value='Masculino'>Masculino</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Controller
                    name='telefono'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label='Telefono'
                        onChange={onChange}
                        placeholder='Ingresar'
                        type='number'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Icon fontSize='1.25rem' icon='tabler:phone' />
                            </InputAdornment>
                          )
                        }}
                        error={Boolean(errors.telefono)}
                        {...(errors.telefono && { helperText: errors.telefono.message })}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={4}>
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
                        placeholder='Opcional'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Icon fontSize='1.25rem' icon='tabler:mail' />
                            </InputAdornment>
                          )
                        }}
                        {...(errors.email && { helperText: errors.email.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name='direccion'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        multiline
                        minRows={3}
                        value={value}
                        onChange={onChange}
                        label='Dirección'
                        placeholder='Ingresa...'
                        error={Boolean(errors.direccion)}
                        sx={{ '& .MuiInputBase-root.MuiFilledInput-root': { alignItems: 'baseline' } }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Icon fontSize='1.25rem' icon='tabler:message' />
                            </InputAdornment>
                          )
                        }}
                        {...(errors.direccion && { helperText: errors.direccion.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name='contacto'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        multiline
                        minRows={3}
                        value={value}
                        onChange={onChange}
                        label='Contacto'
                        placeholder='Ingresa...'
                        error={Boolean(errors.contacto)}
                        sx={{ '& .MuiInputBase-root.MuiFilledInput-root': { alignItems: 'baseline' } }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Icon fontSize='1.25rem' icon='tabler:message' />
                            </InputAdornment>
                          )
                        }}
                        {...(errors.contacto && { helperText: errors.contacto.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button type='submit' variant='contained' sx={{ mr: 3 }}>
                    Guardar
                  </Button>
                  <a href='../'>
                    <Button variant='tonal' color='secondary'>
                      Cancelar
                    </Button>
                  </a>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

export const getStaticProps = async () => {
  // const res = await axios.get('/cards/statistics')

  const res2 = await axios.get('http://54.148.92.78:3000/api/pacientes')
  const apiData = res2.data

  return {
    props: {
      apiData
    }
  }
}

export default UserList
