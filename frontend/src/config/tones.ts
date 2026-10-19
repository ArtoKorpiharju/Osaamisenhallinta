<<<<<<< HEAD
export type Tone = 'danger' | 'warning' | 'info' | 'success' | 'renewal' | 'star' | 'criticalBadge'
=======
export type Tone = 'danger' | 'warning' | 'info' | 'success' | 'renewal'
>>>>>>> origin/main

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
<<<<<<< HEAD
  renewal: { main: '#034182', text: '#000000', background: '#e0e3e8' },
  star: { main: '#ffee00', text: '#000000', background: '#ffee00' },
  criticalBadge: { main: '#c9a227', text: '#8a6d00', background: '#fdf3c8' }
=======
  renewal: { main: '#034182', text: '#000000', background: '#e0e3e8' }
>>>>>>> origin/main
}
