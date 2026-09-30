export const languages = [
    { value: 'en', label: 'English' },
    { value: 'fi', label: 'Finnish' },
] as const

export type Language = (typeof languages[number])['value']