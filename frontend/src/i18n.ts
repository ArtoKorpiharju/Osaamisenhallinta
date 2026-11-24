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
            description: 'Competencies expiring within 90 days',
          },
          requireAction: {
            title: 'Require action',
            description:
              'Invalid or soon-expiring competencies that require action',
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
            addCompetencyInformation: 'Add competency information',
          },
          competencyMissing: 'The competency is missing',
          noRenewalPlanned: 'No renewal planned',
        },
      },
      supervisorOverview: {
        title: 'Supervisor Overview',
        viewAllDetails: 'View all details',
        summary: {
          invalid: {
            title: 'Invalid',
            description: 'Invalid competencies',
            highlight: 'Requires attention',
          },
          expiringSoon: {
            title: 'Expiring soon',
            description: 'Competencies expiring within 90 days',
          },
          requireAction: {
            title: 'Require action',
            description:
              'Invalid or soon-expiring competencies with no planned actions',
          },
          plannedRenewals: {
            title: 'Planned renewals',
            description: 'All planned renewals',
          },
        },
        invalidAndExpiring: {
          title: 'Invalid or soon-expiring competencies',
          columns: {
            employee: 'Employee',
            competency: 'Competency',
            expires: 'Expires',
            urgency: 'Urgency',
            renewalPlan: 'Renewal plan',
          },
          notCompleted: 'Not completed',
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
        competencies: {
        loading: 'Fetching competencies…',
        count_one: '{{count}} Competence',
        count_other: '{{count}} Competences',
        filters: {
          all: 'All',
        },
        types: {
          training: 'Training',
          license: 'License',
          certification: 'Certification',
          skill: 'Skill',
          other: 'Other',
        },
        statuses: {
          expired: 'Invalid',
          missing: 'Missing',
          expiringSoon: 'Expiring soon',
          valid: 'Valid',
        },
        errors: {
          loadCatalogue: 'Could not load competency catalogue',
          load: 'Could not load competencies',
          loadNotFound: 'Competencies could not be found',
          remove: 'Could not remove competency',
          removeNotFound: 'Competency could not be found',
        },
        my: {
          title: 'My Competencies',
          description:
            'View and manage your training, certificates, licences and other competences',
          searchPlaceholder: 'Search by name or type....',
          searchAriaLabel: 'Search competences',
        },
        table: {
          ariaLabel: 'My competencies',
          empty: 'You have no competencies yet.',
          removeAriaLabel: 'Remove {{name}}',
          columns: {
            name: 'My Competencies',
            type: 'Type',
            status: 'Status',
            renewals: 'Renewals',
            validUntil: 'Valid until',
          },
        },
        explore: {
          title: 'Explore competencies',
          description:
            'Discover available training, certificates, licences and other competences',
          searchPlaceholder: 'Search competencies...',
          searchAriaLabel: 'Search competencies',
          tableAriaLabel: 'Explore competencies',
          empty: 'No competencies found.',
          rowsPerPage: 'Rows per page',
          addTooltip: 'Add to My Competencies',
          add: 'Add',
          added: 'Added',
          columns: {
            name: 'Competencies',
            type: 'Type',
            action: 'Action',
          },
          types: {
            training: 'Training',
            license: 'Licence',
            certification: 'Certificate',
            skill: 'Skill',
            other: 'Other',
          },
        },
        removeDialog: {
          title: 'Remove Competency?',
          message: '{{name}} will be removed from My Competencies -list',
          confirm: 'Remove',
          cancel: 'Cancel',
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
            description: '90 päivän sisällä vanhentuvat osaamiset',
          },
          requireAction: {
            title: 'Vaatii toimenpiteitä',
            description:
              'Ei voimassa olevat tai pian vanhentuvat osaamiset, jotka vaativat toimenpiteitä',
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
            addCompetencyInformation: 'Lisää osaamisen tiedot',
          },
          competencyMissing: 'Osaaminen puuttuu',
          noRenewalPlanned: 'Uusimista ei ole suunniteltu',
        },
      },
      supervisorOverview: {
        title: 'Esihenkilön yleisnäkymä',
        viewAllDetails: 'Näytä kaikki tiedot',
        summary: {
          invalid: {
            title: 'Ei voimassa',
            description: 'Ei voimassa olevat osaamiset',
            highlight: 'Vaatii huomiota',
          },
          expiringSoon: {
            title: 'Vanhentumassa',
            description: '90 päivän sisällä vanhentuvat osaamiset',
          },
          requireAction: {
            title: 'Vaatii toimenpiteitä',
            description:
              'Ei voimassa olevat tai pian vanhentuvat osaamiset, jotka vaativat toimenpiteitä',
          },
          plannedRenewals: {
            title: 'Suunnitellut uusimiset',
            description: 'Kaikki suunnitellut uusimiset',
          },
        },
        invalidAndExpiring: {
          title: 'Ei voimassa olevat ja pian vanhentuvat osaamiset',
          columns: {
            employee: 'Työntekijä',
            competency: 'Osaaminen',
            expires: 'Vanhenee',
            urgency: 'Kiireellisyys',
            renewalPlan: 'Uusimissuunnitelma',
          },
          notCompleted: 'Ei suoritettu',
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
      competencies: {
        loading: 'Haetaan osaamisia…',
        count_one: '{{count}} osaaminen',
        count_other: '{{count}} osaamista',
        filters: {
          all: 'Kaikki',
        },
        types: {
          training: 'Koulutus',
          license: 'Lisenssi',
          certification: 'Sertifikaatti',
          skill: 'Taito',
          other: 'Muu',
        },
        statuses: {
          expired: 'Ei voimassa',
          missing: 'Puuttuu',
          expiringSoon: 'Vanhentumassa',
          valid: 'Voimassa',
        },
        errors: {
          loadCatalogue: 'Osaamisluettelon lataaminen epäonnistui',
          load: 'Osaamisten lataaminen epäonnistui',
          loadNotFound: 'Osaamisia ei löytynyt',
          remove: 'Osaamisen poistaminen epäonnistui',
          removeNotFound: 'Osaamista ei löytynyt',
        },
        my: {
          title: 'Omat osaamiset',
          description:
            'Tarkastele ja hallinnoi koulutuksiasi, sertifikaattejasi, lupiasi ja muita osaamisiasi',
          searchPlaceholder: 'Hae nimellä tai tyypillä....',
          searchAriaLabel: 'Hae osaamisia',
        },
        table: {
          ariaLabel: 'Omat osaamiset',
          empty: 'Sinulla ei ole vielä osaamisia.',
          removeAriaLabel: 'Poista {{name}}',
          columns: {
            name: 'Omat osaamiset',
            type: 'Tyyppi',
            status: 'Tila',
            renewals: 'Uusimiset',
            validUntil: 'Voimassa',
          },
        },
        explore: {
          title: 'Selaa osaamisia',
          description:
            'Löydä saatavilla olevia koulutuksia, sertifikaatteja, lupia ja muita osaamisia',
          searchPlaceholder: 'Hae osaamisia...',
          searchAriaLabel: 'Hae osaamisia',
          tableAriaLabel: 'Selaa osaamisia',
          empty: 'Osaamisia ei löytynyt.',
          rowsPerPage: 'Rivejä sivulla',
          addTooltip: 'Lisää omiin osaamisiin',
          add: 'Lisää',
          added: 'Lisätty',
          columns: {
            name: 'Osaamiset',
            type: 'Tyyppi',
            action: 'Toiminto',
          },
          types: {
            training: 'Koulutus',
            license: 'Lisenssi',
            certification: 'Sertifikaatti',
            skill: 'Taito',
            other: 'Muu',
          },
        },
        removeDialog: {
          title: 'Poistetaanko osaaminen?',
          message: '{{name}} poistetaan Omat osaamiset -listalta',
          confirm: 'Poista',
          cancel: 'Peruuta',
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
