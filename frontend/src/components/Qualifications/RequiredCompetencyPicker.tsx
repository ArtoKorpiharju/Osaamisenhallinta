import { useEffect, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { qualificationFormColors } from '../../config/tones'

import {
  fetchQualificationCompetencies,
  type RequiredCompetency,
} from '../../services/adminQualifications'

interface RequiredCompetencyPickerProps {
  value: RequiredCompetency[]
  onChange: (value: RequiredCompetency[]) => void
}

export default function RequiredCompetencyPicker({
  value,
  onChange,
}: RequiredCompetencyPickerProps) {
  const { t } = useTranslation()
  const [options, setOptions] = useState<RequiredCompetency[] | null>(null)
  const [hasError, setHasError] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    let active = true

    void fetchQualificationCompetencies()
      .then((data) => {
        if (active) setOptions(data)
      })
      .catch(() => {
        if (active) setHasError(true)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <Paper variant="outlined" sx={{ p: 3, bgcolor: qualificationFormColors.panel }}>
      <Stack spacing={2}>
       <Typography component="h2" sx={{ fontWeight: 700 }}>
        {t('adminQualifications.requiredCompetencies', {
            defaultValue: 'Required competencies',
        })}
        </Typography>

        <Typography variant="body2" sx={{ maxWidth: 480 }}>
        {t('adminQualifications.requirementsDescription', {
            defaultValue:
            'All competencies below must be valid for the qualification to be granted automatically.',
        })}
        </Typography>

        <Autocomplete
          multiple
          filterSelectedOptions
          size="small"
          options={options ?? []}
          value={value}
          inputValue={inputValue}
          open={isOpen && inputValue.trim().length > 0 && !hasError}
          onOpen={() => {
            setIsOpen(true)
          }}
          onClose={() => {
            setIsOpen(false)
          }}
          onInputChange={(_, nextInputValue) => {
            setInputValue(nextInputValue)
            setIsOpen(nextInputValue.trim().length > 0)
          }}
          renderValue={() => null}
          onChange={(_, selected) => {
            onChange(selected)
            setInputValue('')
            setIsOpen(false)
          }}
          filterOptions={(availableOptions, state) => {
            const query = state.inputValue.trim().toLowerCase()

            if (query.length === 0) {
              return []
            }

            return availableOptions.filter((option) =>
              option.competencyName.toLowerCase().includes(query),
            )
          }}
          getOptionLabel={(option) => option.competencyName}
          getOptionKey={(option) => option.competencyId}
          isOptionEqualToValue={(option, selected) =>
            option.competencyId === selected.competencyId
          }
          loading={!hasError && options === null}
          disabled={hasError}
          noOptionsText={t('adminQualifications.noMatchingCompetencies', {
            defaultValue: 'No competencies match your search.',
          })}
          slotProps={{
            listbox: {
              sx: {
                maxHeight: 324,
                p: 0,
                overflowY: 'auto',
                scrollbarGutter: 'stable',

                '&::-webkit-scrollbar': {
                  width: 8,
                },
                '&::-webkit-scrollbar-track': {
                  bgcolor: qualificationFormColors.fieldGroup,
                },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: qualificationFormColors.outline,
                  borderRadius: '4px',
                },

                '& .MuiAutocomplete-option': {
                  height: 36,
                  minHeight: 36,
                  boxSizing: 'border-box',
                  py: 0,
                },
              },
            },
          }}
          renderOption={({ key, ...optionProps }, option) => (
            <li key={key} {...optionProps}>
              <Typography variant="body2" noWrap>
                {option.competencyName}
              </Typography>
            </li>
          )}
          sx={{ width: '100%', maxWidth: 480 }}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{
                '& .MuiInputBase-root': {
                  bgcolor: qualificationFormColors.input,
                },
              }}
              label={t('adminQualifications.searchCompetencies', {
                defaultValue: 'Add required competence',
              })}
              error={hasError}
              helperText={
                hasError
                  ? t('adminQualifications.competencyLoadError', {
                      defaultValue: 'Could not load competencies.',
                    })
                  : undefined
              }
            />
          )}
        />
        {value.length > 0 && (
            <Box
                sx={{
                width: '100%',
                maxWidth: 480,
                boxSizing: 'border-box',
                bgcolor: qualificationFormColors.fieldGroup,
                border: `1px solid ${qualificationFormColors.outline}`,
                borderRadius: 1,
                overflow: 'hidden',
                }}
            >
                <Typography
                component="h3"
                variant="body2"
                sx={{
                    px: 2,
                    py: 1.25,
                    bgcolor: qualificationFormColors.tableHeader,
                    color: qualificationFormColors.outline,
                    fontWeight: 700,
                    borderBottom: `1px solid ${qualificationFormColors.outline}`,
                }}
                >
                {t('adminQualifications.competencyColumn', {
                    defaultValue: 'Competence',
                })}
                </Typography>

                <Box component="ul" sx={{ m: 0, px: 2, py: 0.5, listStyle: 'none' }}>
                {value.map((competency) => (
                    <Box
                    component="li"
                    key={competency.competencyId}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        py: 0.75,
                        borderBottom: 1,
                        borderColor: 'divider',
                        '&:last-child': { borderBottom: 0 },
                    }}
                    >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {competency.competencyName}
                    </Typography>

                    <IconButton
                        size="small"
                        aria-label={t('adminQualifications.removeCompetency', {
                        defaultValue: 'Remove {{name}}',
                        name: competency.competencyName,
                        })}
                        onClick={() => {
                        onChange(
                            value.filter((item) => item.competencyId !== competency.competencyId),
                        )
                        }}
                    >
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                    </Box>
                ))}
                </Box>
            </Box>
            )}
      </Stack>
    </Paper>
  )
}