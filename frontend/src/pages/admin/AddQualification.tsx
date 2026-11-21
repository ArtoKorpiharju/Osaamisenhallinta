import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'

import RequiredCompetencyPicker from '../../components/Qualifications/RequiredCompetencyPicker'
import {
  fetchAdminQualification,
  type RequiredCompetency,
} from '../../services/adminQualifications'
import { qualificationFormColors } from '../../config/tones'
import PageContainer from '../../components/PageContainer'

export default function AddQualification() {
  const { qualificationId } = useParams<{ qualificationId: string }>()

  return (
    <QualificationForm
      key={qualificationId ?? 'new'}
      qualificationId={qualificationId}
    />
  )
}

function QualificationForm({
  qualificationId,
}: {
  qualificationId: string | undefined
}) {
  const { t } = useTranslation()
  const isEditing = qualificationId !== undefined

  const [name, setName] = useState('')
  const [selectedCompetencies, setSelectedCompetencies] = useState<
    RequiredCompetency[]
  >([])
  const [isLoading, setIsLoading] = useState(isEditing)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (qualificationId === undefined) {
      return
    }

    let active = true

    void fetchAdminQualification(qualificationId)
      .then((qualification) => {
        if (active) {
          setName(qualification.qualificationName)
          setSelectedCompetencies(qualification.requiredCompetencies)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setHasError(true)
          setIsLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [qualificationId])

  const backButton = (
    <Button
      component={Link}
      to="/admin/qualifications"
      sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
    >
      {t('adminQualifications.backToList', {
        defaultValue: '← Back to Qualifications',
      })}
    </Button>
  )

  if (isLoading) {
    return (
      <PageContainer>
        {backButton}
        <Typography role="status" variant="body2">
          {t('adminQualifications.loadingQualification', {
            defaultValue: 'Loading qualification…',
          })}
        </Typography>
      </PageContainer>
    )
  }

  if (hasError) {
    return (
      <PageContainer>
        {backButton}
        <Alert severity="error">
          {t('adminQualifications.loadQualificationError', {
            defaultValue: 'Could not load this qualification.',
          })}
        </Alert>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {backButton}

      <Paper
        variant="outlined"
        sx={{ p: 3, bgcolor: qualificationFormColors.panel }}
      >
        <Stack spacing={3}>
          <div>
            <Typography component="h1" sx={{ fontSize: 18, fontWeight: 700 }}>
              {t(
                isEditing
                  ? 'adminQualifications.editTitle'
                  : 'adminQualifications.addTitle',
                {
                  defaultValue: isEditing
                    ? 'Edit qualification'
                    : 'Add qualification',
                },
              )}
            </Typography>

            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {t('adminQualifications.addDescription', {
                defaultValue: 'Define the name for this qualification.',
              })}
            </Typography>
          </div>

          <Stack
            spacing={0.5}
            sx={{
              width: '100%',
              maxWidth: 480,
              boxSizing: 'border-box',
              p: 3,
              bgcolor: qualificationFormColors.fieldGroup,
              border: `1px solid ${qualificationFormColors.outline}`,
              borderRadius: 1,
            }}
          >
            <Typography
              component="label"
              htmlFor="qualification-name"
              variant="body2"
            >
              {t('adminQualifications.name', { defaultValue: 'Name' })}
              <span
                aria-hidden="true"
                style={{ color: qualificationFormColors.requiredMark }}
              >
                {' *'}
              </span>
            </Typography>

            <TextField
              id="qualification-name"
              required
              size="small"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
              }}
              sx={{
                maxWidth: 400,
                bgcolor: qualificationFormColors.input,
              }}
            />
          </Stack>
        </Stack>
      </Paper>

      <RequiredCompetencyPicker
        value={selectedCompetencies}
        onChange={setSelectedCompetencies}
      />

      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{
          justifyContent: 'flex-end',
          flexWrap: 'wrap',
          p: 2,
          '& .MuiButton-root': {
            textTransform: 'none',
            fontWeight: 700,
          },
        }}
      >
        <Button
          component={Link}
          to="/admin/qualifications"
          variant="outlined"
        >
          {t('adminQualifications.cancel', { defaultValue: 'Cancel' })}
        </Button>

        <Button variant="contained" disabled>
          {t(
            isEditing
              ? 'adminQualifications.saveChanges'
              : 'adminQualifications.addTitle',
            {
              defaultValue: isEditing
                ? 'Save changes'
                : 'Add qualification',
            },
          )}
        </Button>
      </Stack>
    </PageContainer>
  )
}