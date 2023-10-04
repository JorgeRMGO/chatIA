// ** React Imports
import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

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
import ApexBarChart from 'src/views/charts/apex-charts/ApexBarChart'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'
import UserSuspendDialog from 'src/views/apps/user/view/UserSuspendDialog'
import UserSubscriptionDialog from 'src/views/apps/user/view/UserSubscriptionDialog'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

const roleColors = {
  admin: 'error',
  editor: 'info',
  author: 'warning',
  maintainer: 'success',
  subscriber: 'primary'
}

const statusColors = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
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
  const [data, setData] = useState(null)
  const [dataEnfermedad, setDataEnfermedad] = useState(null)
  const [numeroAleatorio, setNumeroAleatorio] = useState(null)
  const [cuadroClinico, setCuadroClinico] = useState([])
  const [mostrarDiagnostico, setMostrarDiagnostico] = useState(false)
  const [diagnostico, setDiagnostico] = useState(null)

  useEffect(() => {
    const query = new URLSearchParams(window.location?.search)
    const id = query.get('id')
    axios
      .get('http://54.148.92.78:3000/api/pacientes/' + id)
      .then(response => {
        setData(response.data.data)
      })
      .catch(error => {
        console.error('Error al cargar datos:', error)
      })
  }, [])

  const initCuadroClinico = async () => {
    let sintomas = []
    for (let i in dataEnfermedad.síntomas) {
      const numero = Math.random().toFixed(2)
      setNumeroAleatorio(numero)
      if (parseFloat(numero) <= parseFloat(dataEnfermedad.síntomas[i])) {
        sintomas.push(i)
      }
    }
    setCuadroClinico(sintomas)
    chat(sintomas)
  }

  const chat = async sintomas => {
    const apiUrl = 'https://api.openai.com/v1/chat/completions' // URL de la API de ChatGPT
    const apiKey = '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' // Tu clave de API de OpenAI
    sintomas.join(', ')

    let chats = [
      {
        role: 'user',
        content:
          'Analisa estos sintomas y dime de que enfermedad especifica se trata' +
          sintomas +
          ', indicame el porcentaje de probabilidad de cada una de las que me menciones '
      }
    ]
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
    console.log(responseApi.data.choices[0].message.content)
    setDiagnostico(responseApi.data.choices[0].message.content)
  }

  useEffect(() => {}, [cuadroClinico])

  useEffect(() => {
    if (dataEnfermedad?.síntomas instanceof Object) {
      initCuadroClinico()
    }
  }, [dataEnfermedad])

  const generarPrueba = async () => {
    await axios
      .get('http://54.148.92.78:3000/api/enfermedades/random')
      .then(response => {
        setDataEnfermedad(response.data.data)
      })
      .catch(error => {
        console.error('Error al cargar datos:', error)
      })
    setMostrarDiagnostico(true)
  }
  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <Card>
            <CardContent sx={{ pt: 13.5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {data.avatar ? (
                <CustomAvatar
                  src={data.avatar}
                  variant='rounded'
                  alt={data.nombre}
                  sx={{ width: 100, height: 100, mb: 4 }}
                />
              ) : (
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={data.avatarColor}
                  sx={{ width: 100, height: 100, mb: 4, fontSize: '3rem' }}
                >
                  {getInitials(data.nombre)}
                </CustomAvatar>
              )}
              <Typography variant='h4' sx={{ mb: 3 }}>
                {data.nombre}
              </Typography>
              <CustomChip
                rounded
                skin='light'
                size='small'
                label={data.edad}
                color={roleColors[data.role]}
                sx={{ textTransform: 'capitalize' }}
              />
            </CardContent>

            <Divider sx={{ my: '0 !important', mx: 6 }} />

            <CardContent sx={{ pb: 4 }}>
              <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                Detalles
              </Typography>
              <Box sx={{ pt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2, color: 'text.secondary' } }}>
                  <Icon icon='guidance:unisex-restroom' fontSize='1.125rem' />
                  <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{data.sexo}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2, color: 'text.secondary' } }}>
                  <Icon icon='teenyicons:phone-outline' fontSize='1.125rem' />
                  <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{data.telefono}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2, color: 'text.secondary' } }}>
                  <Icon icon='mdi:address-marker' fontSize='1.125rem' />
                  <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{data.sexo}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card>
            <CardContent sx={{ pb: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <CustomChip rounded skin='light' size='small' color='primary' label='Detalle' />
              <Box sx={{ display: 'flex', position: 'relative' }}>
                {/* <Sup>$</Sup> */}
                <Typography
                  variant='h4'
                  sx={{ mt: -1, mb: -1.2, color: 'primary.main', fontSize: '2.375rem !important' }}
                >
                  Parametros Medicos
                </Typography>
                {/* <Sub>/ month</Sub> */}
              </Box>
            </CardContent>

            <CardContent>
              <Box sx={{ mt: 2.5, mb: 4 }}>
                <Box sx={{ display: 'flex', mb: 2, alignItems: 'center', '& svg': { mr: 2, color: 'text.secondary' } }}>
                  <Icon icon='material-symbols:ecg-heart' fontSize='1.125rem' />
                  <Typography sx={{ color: 'text.secondary' }}>{data['presion arterial']} mm Hg</Typography>
                </Box>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', '& svg': { mr: 2, color: 'text.danger' } }}>
                  <Icon icon='material-symbols:glucose' fontSize='1.125rem' />
                  <Typography sx={{ color: 'text.secondary' }}>{data.glucosa} mg/dl</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2, color: 'text.secondary' } }}>
                  <Icon icon='ion:body' fontSize='1.125rem' />
                  <Typography sx={{ color: 'text.secondary' }}>{data.IMC} IMC</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2, color: 'text.secondary' } }}>
                  <Icon icon='game-icons:body-height' fontSize='1.125rem' />
                  <Typography sx={{ color: 'text.secondary' }}>{data.altura} mts</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2, color: 'text.secondary' } }}>
                  <Icon icon='mdi:weight-lifter' fontSize='1.125rem' />
                  <Typography sx={{ color: 'text.secondary' }}>{data.altura} kg</Typography>
                </Box>
              </Box>
              <a href='../chat'>
                <Button variant='contained' color='primary' sx={{ mt: 2.5, mb: 4 }}>
                  Generar Diagnostico
                </Button>
              </a>
              <Button variant='contained' color='info' sx={{ mt: 2.5, mb: 4 }} onClick={generarPrueba}>
                Generar Prueba
              </Button>
            </CardContent>
          </Card>
        </Grid>
        {mostrarDiagnostico && (
          <Grid item xs={12} sx={{ display: { mostrarDiagnostico } }}>
            <Card>
              <CardContent sx={{ pb: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <CustomChip rounded skin='light' size='small' color='primary' label='Detalle' />
                <Box sx={{ display: 'flex', position: 'relative' }}>
                  {/* <Sup>$</Sup> */}
                  <Typography
                    variant='h4'
                    sx={{ mt: -1, mb: -1.2, color: 'primary.main', fontSize: '2.375rem !important' }}
                  >
                    Diagnostico
                  </Typography>
                  {/* <Sub>/ month</Sub> */}
                </Box>
              </CardContent>

              <CardContent>
                <Box sx={{ mt: 2.5, mb: 4 }}>
                  <Box
                    sx={{ display: 'flex', mb: 2, alignItems: 'center', '& svg': { mr: 2, color: 'text.secondary' } }}
                  >
                    <Grid container spacing={6}>
                      <Grid item xs={12}>
                        <pre
                          style={{
                            fontFamily: 'Arial, sans-serif',
                            fontSize: '14px',
                            color: '#333',
                            whiteSpace: 'pre-wrap'
                          }}
                        >
                          {diagnostico}
                        </pre>
                      </Grid>
                      <Grid item xs={12}>
                        <ApexBarChart />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    )
  } else {
    return null
  }
}

export default UserViewLeft
