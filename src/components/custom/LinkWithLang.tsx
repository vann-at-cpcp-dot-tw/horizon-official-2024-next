"use client"
import { i18n } from '~~/i18n.config'
import { createLinkWithLangComponent } from "vanns-common-modules/dist/components/next/CreateLinkWithLang"
const LinkWithLang = createLinkWithLangComponent(i18n.defaultLocale.shortCode)
export default LinkWithLang
