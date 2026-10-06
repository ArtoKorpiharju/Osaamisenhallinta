export type Tone = 'danger' | 'warning' | 'info' | 'success' | 'renewal' | 'star'

interface ToneColors {
  main: string
  text: string
  background: string
}

export const tones: Record<Tone, ToneColors> = {
  danger: { main: '#E61E1E', text: '#000000', background: '#EB4C4C' },
  warning: { main: '#E17A14', text: '#000000', background: '#F0A356' },
  info: { main: '#034182', text: '#000000', background: '#e0e3e8' },
  success: { main: '#339C9C', text: '#000000', background: '#92CC8A' },
  renewal: { main: '#034182', text: '#000000', background: '#e0e3e8' },
  star: { main: '#ffee00' }
}
