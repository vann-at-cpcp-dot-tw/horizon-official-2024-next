"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
import { Suspense, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@src/store'
import { useWindowSize } from 'react-use'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import { motion } from "framer-motion"

const termsConfig = [
  {
    key: 'loa',
    label: 'L.O.A',
  },
  {
    key: 'lwl',
    label: 'L.W.L'
  },
  {
    key: 'beam',
    label: 'Beam',
  },
  {
    key: 'draft',
    label: 'Draft',
  },
  {
    key: 'engines',
    label: 'Engines',
  },
  {
    key: 'generator',
    label: 'Generator',
  },
  {
    key: 'displacement',
    label: 'Displacement',
  },
  {
    key: 'fuelCapacity',
    label: 'Fuel Capacity',
  },
  {
    key: 'waterCapacity',
    label: 'Water Capacity',
  },
  {
    key: 'recommendedCapacity',
    label: 'Recommended Capacity',
  },
  {
    key: 'cabins',
    label: 'Cabins',
  }
]

const displayTermKeys = ['loa', 'lwl', 'engines', 'recommendedCapacity', 'cabins']

interface TypeTermListNode {
  key: string
  label: string
  spec: {
    metric: string
    imperial: string
  } | undefined
}

interface TypeProps {
  specTerms: {
    [key:string]: {
      metric: string
      imperial: string
    }
  } | undefined
  merged?: boolean
  [key:string]: any
}

interface TypeState {}

function SpecTable(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  const termList = useMemo(()=>{
    return termsConfig.reduce((acc:TypeTermListNode[], node, index)=>{
      const fieldKey = node.key
      if( !displayTermKeys.includes(fieldKey) ){
        return acc
      }

      if( props.specTerms?.[fieldKey]){
        return [
          ...acc,
          {
            key: node.key,
            label: node.label,
            spec: props.specTerms?.[fieldKey]
          }
        ]
      }

      return acc
    }, [])
  }, [props.specTerms])

  return <Suspense fallback={null}>
    {
      termList && <div className={twMerge('', className)}>
        {
          termList.map((node, index)=>{
            return <motion.div className="border-b border-gray-500 py-3 text-gray-700" key={index}
            variants={{
              enter: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 1,
                  delay: index*0.1,
                  ease: [0.215, 0.610, 0.355, 1.000]
                }
              },
              exit: {
                opacity: 0,
                y: 20,
                transition: {
                  duration: 0.5,
                  ease: [0.215, 0.610, 0.355, 1.000]
                }
              }
            }}
            initial="exit"
            exit="exit"
            animate="enter">
              <div className="row flex-nowrap">
                <div className="col-auto">
                  <div className="w-[190px]">{ node.label }</div>
                </div>
                <div className="col-12 shrink">
                  {
                    props.merged
                      ?<div>
                        {`${node?.spec?.metric} (${node?.spec?.imperial})`}
                      </div>
                      :<div className="row">
                        <div className="col-6">{node?.spec?.metric}</div>
                        <div className="col-6">{node?.spec?.imperial}</div>
                      </div>
                  }
                </div>
              </div>
            </motion.div>
          })
        }
      </div>
    }
  </Suspense>
}

export default SpecTable