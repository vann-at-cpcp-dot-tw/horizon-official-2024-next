"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense } from 'react'
import LinkWithLang from "@src/components/custom/LinkWithLang"
import buttonStyles from '@src/components/ui/button.module.sass'
import { Button } from "@src/components/ui/button"
import { useParams } from "next/navigation"

interface TypeProps {}
interface TypeState {}

function Intro(props:TypeProps, ref:React.ReactNode){

  const { lang } = useParams()

  return <Suspense fallback={null}>
    <div className="py-[100px]">
      <div className="container mb-10">
        <div className="serif mb-6 text-center text-[48px] text-major-700">Exploring <span className="italic">Possibilities</span>, Daring to <span className="italic">Challenge</span><br/>and Pursuing Excellence.</div>
        <div className="serif relative mx-auto max-w-[770px] text-center text-[24px] text-major-700">Since 1987, Horizon has defined, perfected and consistently exceeded the standards for design and craftsmanship.<br/>Horizon has pioneered the visionary boat Master designs and builds exceptional motor yachts.<br/>Horizon is Advanced Composites Technology and Naval Architecture .<br/>A leader in the field, setting the standard for innovation.<br/><br/>The Horizon Group is dedicated to bringing your yachting dreams to life.</div>
      </div>
      <div className="flex justify-center">
        <Button variant="outline" className={buttonStyles['rounded-outline']}>
          <LinkWithLang href="/about" lang={lang}>About</LinkWithLang>
        </Button>
      </div>
    </div>
  </Suspense>
}

export default Intro