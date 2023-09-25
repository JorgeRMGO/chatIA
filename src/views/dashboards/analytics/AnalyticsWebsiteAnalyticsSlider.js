// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Badge from '@mui/material/Badge'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// ** Third Party Components
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const data = [
  {
    title: '',
    img: '/images/logos_sanos/logo-sanos-blanco-letras.png',
    details: {
      Sessions: '',
      'Page Views': '',
      Leads: '',
      Conversions: ''
    }
  },
  {
    title: '',
    img: '/images/logos_sanos/logo-sanos-blanco-letras.png',
    details: {
      Spend: '12h',
      Orders: '18',
      Order: '127',
      Items: '2.3k'
    }
  },
  {
    title: '',
    img: '/images/logos_sanos/logo-sanos-blanco-letras.png',
    details: {
      Direct: '268',
      Organic: '890',
      Referral: '62',
      Campaign: '1.2k'
    }
  }
]

const Slides = ({ theme }) => {
  return (
    <>
      {data.map((slide, index) => {
        return (
          <Box
            key={index}
            className='keen-slider__slide'
            sx={{ p: 6, '& .MuiTypography-root': { color: 'common.white' } }}
          >
            <Typography variant='h5' sx={{ mb: 0.5 }}></Typography>
            <Typography variant='body2' sx={{ mb: 4.5 }}></Typography>
            <Grid container>
              <Grid item xs={12} sm={8} sx={{ order: [2, 1] }}>
                <Typography variant='h6' sx={{ mb: 4.5 }}>
                  {slide.title}
                </Typography>
                <Grid container spacing={4.5}>
                  <img src={slide.img} alt={slide.title} width={400} height={60} />
                </Grid>
              </Grid>
              {/* <Grid
                item
                xs={12}
                sm={4}
                sx={{
                  order: [1, 2],
                  textAlign: 'center',
                  '& img': {
                    height: '160px !important',
                    maxWidth: 'none !important',
                    [theme.breakpoints.up('sm')]: {
                      top: '50%',
                      position: 'absolute',
                      right: theme.spacing(6),
                      transform: 'translateY(-50%)',
                      marginBottom: 5
                    }
                  }
                }}
              >
                
              </Grid> */}
            </Grid>
          </Box>
        )
      })}
    </>
  )
}

const AnalyticsWebsiteAnalyticsSlider = () => {
  // ** States
  const [loaded, setLoaded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  // ** Hook
  const theme = useTheme()

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      initial: 0,
      rtl: theme.direction === 'rtl',
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel)
      },
      created() {
        setLoaded(true)
      }
    },
    [
      slider => {
        let mouseOver = false
        let timeout

        const clearNextTimeout = () => {
          clearTimeout(timeout)
        }

        const nextTimeout = () => {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 4000)
        }
        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  return (
    <Card sx={{ position: 'relative', backgroundColor: 'primary.main' }}>
      {loaded && instanceRef.current && (
        <Box className='swiper-dots' sx={{ top: 4, right: 6, position: 'absolute' }}>
          {[...Array(instanceRef.current.track.details.slides.length).keys()].map(idx => {
            return (
              <Badge
                key={idx}
                variant='dot'
                component='div'
                className={clsx({ active: currentSlide === idx })}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                sx={{
                  mr: `${theme.spacing(3.5)} !important`,
                  '& .MuiBadge-dot': {
                    width: '8px !important',
                    height: '8px !important',
                    backgroundColor: `${hexToRGBA(theme.palette.common.white, 0.4)} !important`
                  },
                  '&.active .MuiBadge-dot': {
                    backgroundColor: `${theme.palette.common.white} !important`
                  }
                }}
              />
            )
          })}
        </Box>
      )}
      <Box ref={sliderRef} className='keen-slider'>
        <Slides theme={theme} />
      </Box>
    </Card>
  )
}

export default AnalyticsWebsiteAnalyticsSlider
