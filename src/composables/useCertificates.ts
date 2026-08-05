import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export interface Certificate {
  id: number
  title: string
  issuer: string
  date: string
  image: string
}

interface CertificateData {
  title: string
  issuer: string
  date: string
}

export function useCertificates() {
  const { tm } = useI18n()

  const certificates = computed(() => {
    const translations = tm('certificates.items') as CertificateData[]
    return translations.map((item, index) => ({
      id: index + 1,
      ...item,
      image: '',
    })) as Certificate[]
  })

  return { certificates }
}
