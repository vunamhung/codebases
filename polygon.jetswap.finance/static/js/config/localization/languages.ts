import { Language } from 'contexts/Localization/types'

export const EN: Language = { locale: 'en-US', language: 'English', code: 'en' }
export const ZHCN: Language = { locale: 'zh-CN', language: '简体中文', code: 'cn' }
export const JAJP: Language = { locale: 'ja-JP', language: '日本語', code: 'ja' }

export const languages = {
  'en-US': EN,
  'zh-CN': ZHCN,
  'ja-JP': JAJP,
}

export const languageList = Object.values(languages)
