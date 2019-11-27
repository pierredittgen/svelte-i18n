import IntlMessageFormat from 'intl-messageformat'
import memoize from 'fast-memoize'

import { MemoizedIntlFormatter } from '../types'
import { getCurrentLocale } from '../stores/locale'
import { getOptions } from '../configs'

const getIntlFormatterOptions = (
  type: 'time' | 'number' | 'date',
  name: string
): any => {
  const formats = getOptions().formats
  if (type in formats && name in formats[type]) {
    return formats[type][name]
  }

  throw new Error(`[svelte-i18n] Unknown "${name}" ${type} format.`)
}

export const getNumberFormatter: MemoizedIntlFormatter<
  Intl.NumberFormat,
  Intl.NumberFormatOptions
> = memoize(({ locale, format, ...options } = {}) => {
  locale = locale || getCurrentLocale()
  if (locale == null) {
    throw new Error('[svelte-i18n] A "locale" must be set to format numbers')
  }

  if (format) {
    options = getIntlFormatterOptions('number', format) || {}
  }

  return new Intl.NumberFormat(locale, options)
})

export const getDateFormatter: MemoizedIntlFormatter<
  Intl.DateTimeFormat,
  Intl.DateTimeFormatOptions
> = memoize(({ locale, format, ...options } = {}) => {
  locale = locale || getCurrentLocale()
  if (locale == null) {
    throw new Error('[svelte-i18n] A "locale" must be set to format dates')
  }

  const hasInlineArgs = Object.keys(options).length > 0
  if (!hasInlineArgs) {
    options =
      typeof format === 'string'
        ? getIntlFormatterOptions('date', format)
        : getIntlFormatterOptions('date', 'short')
  }

  return new Intl.DateTimeFormat(locale, options)
})

export const getTimeFormatter: MemoizedIntlFormatter<
  Intl.DateTimeFormat,
  Intl.DateTimeFormatOptions
> = memoize(({ locale, format, ...options } = {}) => {
  locale = locale || getCurrentLocale()
  if (locale == null) {
    throw new Error(
      '[svelte-i18n] A "locale" must be set to format time values'
    )
  }

  const hasInlineArgs = Object.keys(options).length > 0
  if (!hasInlineArgs) {
    options =
      typeof format === 'string'
        ? getIntlFormatterOptions('time', format)
        : getIntlFormatterOptions('time', 'short')
  }

  return new Intl.DateTimeFormat(locale, options)
})

export const getMessageFormatter = memoize(
  (message: string, locale: string) =>
    new IntlMessageFormat(message, locale, getOptions().formats)
)