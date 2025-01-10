// Next Imports
import { Public_Sans } from 'next/font/google'
import { Noto_Sans_Lao } from 'next/font/google' // Import the Noto Sans Lao font

// MUI Imports
import type { Theme } from '@mui/material/styles'

// Type Imports
import type { Settings } from '@core/contexts/settingsContext'
import type { SystemMode, Skin } from '@core/types'

// Theme Options Imports
import overrides from './overrides'
import colorSchemes from './colorSchemes'
import spacing from './spacing'
import shadows from './shadows'
import customShadows from './customShadows'
import typography from './typography'

const public_sans = Public_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800', '900'] })
const noto_sans_lao = Noto_Sans_Lao({ subsets: ['latin'], weight: ['400', '700'] }) // Initialize the Noto Sans Lao font

const theme = (settings: Settings, mode: SystemMode, direction: Theme['direction']): Theme => {
  return {
    direction,
    components: overrides(settings.skin as Skin),
    colorSchemes: colorSchemes(settings.skin as Skin),
    ...spacing,
    shape: {
      borderRadius: 6,
      customBorderRadius: {
        xs: 2,
        sm: 4,
        md: 6,
        lg: 8,
        xl: 10
      }
    },
    shadows: shadows(mode),
    typography: {
      ...typography(`${public_sans.style.fontFamily}, ${noto_sans_lao.style.fontFamily}`),
      fontSize: 16, // Adjust the base font size
      h1: {
        fontSize: '2.5rem', // Adjust the font size for h1
      },
      h2: {
        fontSize: '2rem', // Adjust the font size for h2
      },
      body1: {
        fontSize: '1rem', // Adjust the font size for body1
      },
      // Add more typography settings as needed
    },
    customShadows: customShadows(mode),
    mainColorChannels: {
      light: '47 43 61',
      dark: '225 222 245',
      lightShadow: '47 43 61',
      darkShadow: '19 17 32'
    }
  } as Theme
}

export default theme