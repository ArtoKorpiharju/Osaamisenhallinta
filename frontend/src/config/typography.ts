import {
  createTheme,
  responsiveFontSizes,
  type TypographyVariantsOptions,
} from '@mui/material/styles'

// Kaikki tekstityylit määritellään tässä. Värit pysyvät tones.ts:ssä.
const style = (sizePx: number, weight: number, lineHeight: number) => ({
  fontSize: `${String(sizePx / 16)}rem`,
  fontWeight: weight,
  lineHeight,
  letterSpacing: 'normal', // ohittaa MUI:n oletusarvot
})

export const typography: TypographyVariantsOptions = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',

  h1: style(32, 700, 1.2), // sivun pääotsikko
  h2: style(18, 700, 1.3), // osion / Panelin otsikko
  h3: style(16, 700, 1.4), // kortin / komponentin otsikko
  subtitle1: style(15, 600, 1.4),
  subtitle2: style(13, 600, 1.5), // korostettu pieni teksti, taulukon otsikko/solu
  body1: style(14, 400, 1.5), // leipäteksti
  body2: style(13, 400, 1.5), // pienempi teksti, taulukkotekstit
  button: { ...style(14, 600, 1.75), textTransform: 'none' },
  caption: style(12, 400, 1.4), // lisätiedot, chipit, päivämäärät
}

// Muut teeman osat (esim. värit) lisätään tähän, kun niitä tarvitaan.
// Responsiivinen skaalaus koskee vain otsikoita, ei leipätekstiä.
export const theme = responsiveFontSizes(createTheme({ typography }), {
  variants: ['h1', 'h2', 'h3'],
})
