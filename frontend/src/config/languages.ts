export const languages = [
  { value: 'en', labelKey: 'languages.english' },
  { value: 'fi', labelKey: 'languages.finnish' },
] as const

export type Language = (typeof languages)[number]['value']
