
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'
import { QueryDealersWithRegion } from '~/queries/pages/dealers.gql'
import { fetchGQL } from '~/lib/apollo'
import { headers } from 'next/headers'
import Form from "./(templates)/Form"

interface TypeProps {
  params: {
    lang: string
  }
}

interface TypeState {}

async function PageContact({params}:TypeProps){
  const { lang } = params
  const headersList = headers()
  const referer = headersList.get('referer')

  let data
  if( CONTENT_TYPE === 'dealer' ){
    data = await fetchGQL(QueryDealersWithRegion)
  }

  return <>
    <Form lang={lang} referer={referer}>
      {
        CONTENT_TYPE === 'dealer' && <div className="mt-10 bg-major-900 py-20 text-white">
          <div className="container">
            <div className="serif mb-8 text-center text-[32px] font-300 text-white">Personal <i>and</i>  Virtual Tours  <i>available.</i></div>
          </div>

          <div className="container">
            <div className="row">
              {
                data?.dealerRegions?.nodes?.map?.((node:any, index:number)=>{
                  return <div className="lg:col-6 col-12 mb-5" key={index}>
                    <div className="mb-2 text-[14px] text-white">{ node?.name }</div>
                    {
                      node?.dealers?.nodes?.map((dealerNode:{[key:string]:any}, dealerIndex:number)=>{
                        return <div className="mb-5" key={`${index}-${dealerIndex}`}>
                          {/* <div className="text-[14px] text-gray-300">{ dealerNode?.dealerRegions?.nodes?.[0]?.name }</div> */}
                          <div className="mb-1 flex flex-nowrap items-center">
                            <div className="shrink text-[20px] text-golden-700">{ dealerNode?.title }</div>
                            {
                              dealerNode.dealerCustomFields?.googleMapLink && <a className="btn-opacity ml-2 mt-0.5 text-golden-500" href={dealerNode.dealerCustomFields.googleMapLink} target="_blank">Map</a>
                            }
                          </div>
                          {
                            dealerNode?.dealerCustomFields?.contactNumber && <div className="mb-0.5 font-300 text-white">
                              <a href={`tel:${dealerNode.dealerCustomFields.contactNumber.replace(' ', '').replace('-', '')}`}>{ dealerNode.dealerCustomFields.contactNumber }</a>
                            </div>
                          }
                          {
                            dealerNode?.dealerCustomFields?.contactEmail && <div className="mb-0.5 font-300 text-white">
                              <a href={`mailto:${dealerNode.dealerCustomFields.contactEmail}`}>{dealerNode.dealerCustomFields.contactEmail}</a>
                            </div>
                          }
                          {
                            dealerNode.dealerCustomFields?.address && <div className="mb-0.5 font-300 text-white">{dealerNode.dealerCustomFields?.address}</div>
                          }
                        </div>
                      })
                    }
                  </div>
                })
              }
            </div>
          </div>
        </div>
      }
    </Form>
  </>
}

export default PageContact