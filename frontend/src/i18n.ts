import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      appName: 'Competence Management',
      languages: {
        english: 'English',
        finnish: 'Finnish',
      },
      roles: {
        employee: 'Employee',
        supervisor: 'Supervisor',
        admin: 'Admin',
      },
      navigation: {
        overview: 'Overview',
        qualifications: 'Qualifications',
        competencies: 'Competencies',
        renewals: 'Renewals',
        log: 'Log',
        settings: 'Settings',
      },
      profile: {
        showProfile: 'Show profile',
        signOut: 'Sign out',
        switchRole: 'Switch role',
      },
      common: {
        critical: 'Critical',
      },
      employeeOverview: {
        title: 'Employee Overview',
        viewAllDetails: 'View all details',
        summary: {
          invalid: {
            title: 'Invalid',
            description: 'Invalid competencies',
            highlight: 'Requires attention',
          },
          expiringSoon: {
            title: 'Expiring soon',
            description: 'Expiring within 90 days',
          },
          missingRenewals: {
            title: 'Missing renewals',
            description:
              'Invalid or soon expiring competencies without a planned renewal',
          },
          plannedRenewals: {
            title: 'Planned renewals',
            description: 'All planned renewals',
          },
        },
        qualifications: {
          title: 'My Qualifications',
          viewAll: 'View All',
          noExpiryDate: 'No expiry date',
          columns: {
            qualification: 'Qualification',
            status: 'Status',
            requirements: 'Requirements',
            validUntil: 'Valid until',
          },
          statuses: {
            invalid: 'Invalid',
            expiringSoon: 'Expiring soon',
            qualified: 'Qualified',
          },
          favorite: 'My favorite',
          employerRequirement: 'Employer requirement',
          primaryQualification: 'Primary qualification',
        },
        actionRequired: {
          title: 'Action required',
          empty: 'Nothing needs your attention right now.',
          statuses: {
            expired: 'Invalid',
            expiringSoon: 'Expiring soon',
          },
          actions: {
            planRenewal: 'Plan renewal',
            viewRenewalPlan: 'View renewal plan',
            uploadRenewalCertificate: 'Upload renewal certificate',
          },
          noRenewalPlanned: 'No renewal planned',
        },
      },
      supervisorOverview: {
        title: 'Supervisor Overview',
        viewAllDetails: 'View all details',
        summary: {
          outdated: {
            title: 'Outdated',
            description: 'Expired competencies',
            highlight: 'Requires attention',
          },
          expiring: {
            title: 'Expiring',
            description: 'Expiring within 90 days',
          },
          renewals: {
            title: 'Renewals',
            description: 'Missing renewals',
          },
          planned: {
            title: 'Planned',
            description: 'Planned renewals',
          },
        },
        expirations: {
          title: 'Upcoming Expirations',
          columns: {
            employee: 'Employee',
            competency: 'Competency',
            expires: 'Expires',
            urgency: 'Urgency',
            renewalPlan: 'Renewal plan',
          },
          notPlanned: 'Not planned',
          dayAbbreviation: 'd',
        },
      },
      adminOverview: {
        title: 'Admin Center',
        description:
          'Manage competency definitions and qualification requirements.',
        cards: {
          certificates: 'Total certificates',
          skills: 'Total skills',
          trainings: 'Total trainings',
          licenses: 'Total licenses',
          qualifications: 'Total qualifications',
        },
        quickActions: {
          title: 'Quick actions',
          addCompetence: 'Add competence',
          addQualification: 'Add qualification',
        },
      },
      adminCompetencies: {
        title: 'Competencies',
        description: 'Manage competencies',
        addButton: 'Add new competency',
        searchLabel: 'Search competencies',
        loading: 'Loading competencies...',
        errors: {
          load: 'Could not load competencies.',
          badRequest: 'The competencies request was invalid.',
          notFound: 'Competencies could not be found.',
          validation:
            'Enter a name and type. Limited validity must be at least 1 month.',
          create: 'Could not add competency.',
          createBadRequest: 'The competency details are invalid.',
          conflict: 'A competency with this name already exists.',
        },
        resultCount_one: '{{count}} competency',
        resultCount_other: '{{count}} competencies',
        table: {
          competency: 'Competency',
          type: 'Type',
          validity: 'Validity',
          noExpiry: 'Does not expire',
          month_one: '{{count}} month',
          month_other: '{{count}} months',
        },
        types: {
          training: 'Training',
          license: 'License',
          certificate: 'Certificate',
          skill: 'Skill',
          other: 'Other',
        },
        dialog: {
          title: 'Add competency',
          name: 'Name',
          type: 'Type',
          validity: 'Validity',
          limitedTime: 'Valid for a limited time',
          noExpiry: 'Does not expire',
          validFor: 'Valid for',
          month_one: 'month',
          month_other: 'months',
          cancel: 'Cancel',
          add: 'Add competency',
          adding: 'Adding...',
        },
      },
    },
  },
  fi: {
    translation: {
      appName: 'Osaamisenhallinta',
      languages: {
        english: 'Englanti',
        finnish: 'Suomi',
      },
      roles: {
        employee: 'Työntekijä',
        supervisor: 'Esihenkilö',
        admin: 'Ylläpitäjä',
      },
      navigation: {
        overview: 'Yleisnäkymä',
        qualifications: 'Kelpoisuudet',
        competencies: 'Osaamiset',
        renewals: 'Uusimiset',
        log: 'Loki',
        settings: 'Asetukset',
      },
      profile: {
        showProfile: 'Näytä profiili',
        signOut: 'Kirjaudu ulos',
        switchRole: 'Vaihda roolia',
      },
      common: {
        critical: 'Kriittinen',
      },
      employeeOverview: {
        title: 'Työntekijän yleisnäkymä',
        viewAllDetails: 'Näytä kaikki tiedot',
        summary: {
          invalid: {
            title: 'Ei voimassa',
            description: 'Ei voimassa olevat osaamiset',
            highlight: 'Vaatii huomiota',
          },
          expiringSoon: {
            title: 'Vanhentumassa',
            description: 'Vanhentuvat 90 päivän sisällä',
          },
          missingRenewals: {
            title: 'Puuttuvat uusimiset',
            description:
              'Ei voimassa olevat tai pian vahentuvat osaamiset, joihin ei ole suunniteltu uusimista',
          },
          plannedRenewals: {
            title: 'Suunnitellut uusimiset',
            description: 'Kaikki suunnitellut uusimiset',
          },
        },
        qualifications: {
          title: 'Omat kelpoisuudet',
          viewAll: 'Näytä kaikki',
          noExpiryDate: 'Ei vanhene',
          columns: {
            qualification: 'Kelpoisuus',
            status: 'Tila',
            requirements: 'Vaatimukset',
            validUntil: 'Voimassa asti',
          },
          statuses: {
            invalid: 'Ei voimassa',
            expiringSoon: 'Vanhentumassa',
            qualified: 'Kelvollinen',
          },
          favorite: 'Oma suosikki',
          employerRequirement: 'Työnantajan vaatimus',
          primaryQualification: 'Ensisijainen kelpoisuus',
        },
        actionRequired: {
          title: 'Toimenpiteitä vaaditaan',
          empty: 'Mikään ei vaadi huomiotasi tällä hetkellä.',
          statuses: {
            expired: 'Ei voimassa',
            expiringSoon: 'Vanhentumassa',
          },
          actions: {
            planRenewal: 'Suunnittele uusiminen',
            viewRenewalPlan: 'Näytä uusimissuunnitelma',
            uploadRenewalCertificate: 'Lataa uusimistodistus',
          },
          noRenewalPlanned: 'Uusimista ei ole suunniteltu',
        },
      },
      supervisorOverview: {
        title: 'Esihenkilön yleisnäkymä',
        viewAllDetails: 'Näytä kaikki tiedot',
        summary: {
          outdated: {
            title: 'Vanhentuneet',
            description: 'Vanhentuneet osaamiset',
            highlight: 'Vaatii huomiota',
          },
          expiring: {
            title: 'Vanhentumassa',
            description: 'Vanhentuvat 90 päivän sisällä',
          },
          renewals: {
            title: 'Uusimiset',
            description: 'Puuttuvat uusimiset',
          },
          planned: {
            title: 'Suunnitellut',
            description: 'Suunnitellut uusimiset',
          },
        },
        expirations: {
          title: 'Tulevat vanhentumiset',
          columns: {
            employee: 'Työntekijä',
            competency: 'Osaaminen',
            expires: 'Vanhenee',
            urgency: 'Kiireellisyys',
            renewalPlan: 'Uusimissuunnitelma',
          },
          notPlanned: 'Ei suunniteltu',
          dayAbbreviation: 'pv',
        },
      },
      adminOverview: {
        title: 'Ylläpitäjän hallintakeskus',
        description: 'Hallinnoi osaamismäärittelyjä ja kelpoisuusvaatimuksia.',
        cards: {
          certificates: 'Sertifikaatteja yhteensä',
          skills: 'Taitoja yhteensä',
          trainings: 'Koulutuksia yhteensä',
          licenses: 'Lisenssejä yhteensä',
          qualifications: 'Kelpoisuuksia yhteensä',
        },
        quickActions: {
          title: 'Pikatoiminnot',
          addCompetence: 'Lisää osaaminen',
          addQualification: 'Lisää kelpoisuus',
        },
      },
      adminCompetencies: {
        title: 'Osaamiset',
        description: 'Hallinnoi osaamisia',
        addButton: 'Lisää osaaminen',
        searchLabel: 'Hae osaamisia',
        loading: 'Ladataan osaamisia...',
        errors: {
          load: 'Osaamisten lataaminen epäonnistui.',
          badRequest: 'Osaamispyyntö oli virheellinen.',
          notFound: 'Osaamisia ei löytynyt.',
          validation:
            'Täytä nimi ja tyyppi. Määräaikaisen voimassaolon on oltava vähintään kuukausi.',
          create: 'Osaamisen lisääminen epäonnistui.',
          createBadRequest: 'Osaamisen tiedot olivat virheelliset.',
          conflict: 'Samanniminen osaaminen on jo olemassa.',
        },
        resultCount_one: '{{count}} osaaminen',
        resultCount_other: '{{count}} osaamista',
        table: {
          competency: 'Osaaminen',
          type: 'Tyyppi',
          validity: 'Voimassaolo',
          noExpiry: 'Ei vanhene',
          month_one: '{{count}} kuukausi',
          month_other: '{{count}} kuukautta',
        },
        types: {
          training: 'Koulutus',
          license: 'Lisenssi',
          certificate: 'Sertifikaatti',
          skill: 'Taito',
          other: 'Muu',
        },
        dialog: {
          title: 'Lisää osaaminen',
          name: 'Nimi',
          type: 'Tyyppi',
          validity: 'Voimassaolo',
          limitedTime: 'Voimassa määräajan',
          noExpiry: 'Ei vanhene',
          validFor: 'Voimassa',
          month_one: 'kuukausi',
          month_other: 'kuukautta',
          cancel: 'Peruuta',
          add: 'Lisää osaaminen',
          adding: 'Lisätään...',
        },
      },
    },
  },
} as const

void i18n
  // Detect the user's language from the browser or saved settings.
  .use(LanguageDetector)

  // Connect the i18next instance to React.
  .use(initReactI18next)

  // Configure and start i18next.
  .init({
    resources,
    debug: import.meta.env.DEV && import.meta.env.MODE !== 'test',
    fallbackLng: 'en', //jos ei oo translation
    supportedLngs: ['en', 'fi'],
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
