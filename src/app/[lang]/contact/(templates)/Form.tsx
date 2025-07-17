"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const API_BASE = process.env.NEXT_PUBLIC_API_BASE
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense, useCallback } from 'react'

import Image from "next/image"
import { useRouter } from "next/navigation"
import { twMerge } from 'tailwind-merge'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
import { tools as langTools } from "vanns-common-modules/dist/use/next/useLangGuard"
import { useTranslate } from "vanns-common-modules/dist/use/react"

import Alert from "~/components/custom/Alert"
import ContentLightbox from '~/components/custom/ContentLightbox'
import Loading from '~/components/custom/icons/Loading'
import LinkWithLang from '~/components/custom/LinkWithLang'
import { Button } from '~/components/ui/button'
import buttonStyles from '~/components/ui/button.module.sass'
import { useStore } from "~/store"
import useForm from "~/use/useForm"
import { i18n } from '~~/i18n.config'

const { pathnameWithLang } = langTools(i18n)
interface TypeProps {
  children?: React.ReactNode
  [key:string]: any
}

interface TypeState {}

function Form(props:TypeProps, ref:React.ReactNode){
  const store = useStore()
  const router = useRouter()
  const { __ } = useTranslate()
  const { referer, lang, children } = props

  const {form, setForm, loading:submitLoading, handleSubmit} = useForm(`${API_BASE}wp-json/api/v1/contact-form-log/push`, {
    first_name: '',
    last_name: '',
    country: '',
    postcode: '',
    email: '',
    phone: '',
    current_boat_owned: '',
    message: '',
  })

  const handleClose = useCallback(()=>{
    if( !referer ){
      router.push(pathnameWithLang('/', lang), {scroll:false})
      return
    }

    const url = new URL(referer)
    if( url.pathname.includes('/contact')){
      router.push(pathnameWithLang('/', lang), {scroll:false})
    }else{
      router.push(url.pathname, {scroll:false})
    }
  }, [router, referer, lang])

  const { className } = props

  return <ContentLightbox
  onClose={handleClose}>
    <>
      <Alert id="ContactForm" title="Success">
        <div className="text-center text-[#4A4A4A]">{ __('We will get in touch with you soon.') }</div>
      </Alert>
      <div className="mb-10">
        <div className="hidden">{referer}</div>
        <div className="container serif text-center text-[40px] text-major-900">{ __('Contact Us') }</div>
        <div className="container serif mb-2 text-center text-[26px] italic leading-[1.2] text-gray-900 lg:mb-4">
          { __('Thank you for visiting our website.') }
        </div>
        <div className="container text-center text-[14px] text-gray-700">
          <span dangerouslySetInnerHTML={{__html: __('If you have any comments, inquiries or questions concerning our products & services,<br/>please complete the following form and we will get in touch with you soon.') || ''}}></span>
        </div>
      </div>

      <form className="container"
      style={{
        maxWidth: '940px',
      }}
      onSubmit={(e)=>{
        e.preventDefault()
        handleSubmit(form).then((result)=>{
          if( result.success ){
            store.lightboxOpen('ContactForm')
          }
        })
      }}>
        <div className="mb-8">
          <div className="serif mb-2 text-major-900">
            <span className="text-[24px] italic">{ __('Name') } *</span>
          </div>
          <input className="mb-4 w-full border-b border-gray-500 bg-transparent pb-2 placeholder:text-gray-300"
          type="text"
          placeholder={ __('First Name') }
          required
          value={form.first_name}
          onChange={(e)=>{
            setForm({
              first_name: e.target.value
            })
          }}/>
          <input className="w-full border-b border-gray-500 bg-transparent pb-2 placeholder:text-gray-300"
          type="text"
          placeholder={ __('Last Name') }
          required
          value={form.last_name}
          onChange={(e)=>{
            setForm({
              last_name: e.target.value
            })
          }}/>
        </div>

        <div className="mb-8">
          <div className="serif text-major-900">
            <span className="text-[24px] italic">{ __('Country') } *</span>
          </div>
          <input className="w-full border-b border-gray-500 bg-transparent pb-2 placeholder:text-gray-300" type="text" required
          value={form.country}
          onChange={(e)=>{
            setForm({
              country: e.target.value
            })
          }}/>
        </div>

        <div className="mb-8">
          <div className="serif text-major-900">
            <span className="text-[24px] italic">{ __('Postcode') } *</span>
          </div>
          <input className="w-full border-b border-gray-500 bg-transparent pb-2 placeholder:text-gray-300" type="text" required
          value={form.postcode}
          onChange={(e)=>{
            setForm({
              postcode: e.target.value
            })
          }}/>
        </div>

        <div className="mb-8">
          <div className="serif text-major-900">
            <span className="text-[24px] italic">{ __('Email') } *</span>
          </div>
          <input className="w-full border-b border-gray-500 bg-transparent pb-2 placeholder:text-gray-300" type="email" required
          value={form.email}
          onChange={(e)=>{
            setForm({
              email: e.target.value
            })
          }}/>
        </div>

        <div className="mb-8">
          <div className="serif text-major-900">
            <span className="text-[24px] italic">{ __('Phone') } *</span>
          </div>
          <input className="w-full border-b border-gray-500 bg-transparent pb-2 placeholder:text-gray-300" type="tel" required
          value={form.phone}
          onChange={(e)=>{
            setForm({
              phone: e.target.value
            })
          }}/>
        </div>

        <div className="mb-8">
          <div className="serif text-major-900">
            <span className="text-[24px] italic">{ __('Current Boat Owned') }</span>
          </div>
          <input className="w-full border-b border-gray-500 bg-transparent pb-2 placeholder:text-gray-300" type="text"
          value={form.current_boat_owned}
          onChange={(e)=>{
            setForm({
              current_boat_owned: e.target.value
            })
          }}/>
        </div>

        <div className="mb-8">
          <div className="serif mb-2 text-major-900">
            <span className="text-[24px] italic">{ __('Message') }</span>
          </div>
          <RatioArea ratio="25">
            <textarea className="absolute left-0 top-0 size-full border border-gray-500 bg-transparent p-4 text-[16px]"
            value={form.message}
            onChange={(e)=>{
              setForm({
                message: e.target.value
              })
            }}></textarea>
          </RatioArea>
        </div>

        <div className="mx-auto text-center text-[14px] text-gray-500" style={{
          maxWidth: '450px',
        }}>
          { __('By submitting a contact request, you provide consent for us to collect and use your information pursuant to our') }
          &nbsp;
          <LinkWithLang className="btn-opacity underline hover:underline" href="/privacy-policy" lang={lang}>
            { __('Privacy Policy and Terms of Use') }
          </LinkWithLang>
        </div>

        <div className="flex justify-center py-8">
          {
            submitLoading
              ? <Loading style={{width:'44px'}} fill="var(--color-golden-900)"/>
              : <Button variant="outline" className={buttonStyles['rounded-outline']} type="submit">{ __('SUBMIT') }</Button>
          }
        </div>
      </form>
      { children }
    </>
  </ContentLightbox>
}

export default Form