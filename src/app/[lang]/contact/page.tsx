const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { headers } from 'next/headers'
import T from 'vanns-common-modules/dist/components/react/T'

import LinkWithLang from '~/components/custom/LinkWithLang'
import { fetchGQL } from "~/lib/apollo/server"
import { isEmpty } from '~/lib/utils'
import { QueryDealersWithRegion } from '~/queries/pages/dealers.gql'

import Form from "./(templates)/Form"

interface TypeProps {
  params: Promise<{
    lang: string
  }>
}

interface TypeState {}

async function PageContact({params}:TypeProps){
  const { lang } = await params
  const headersList = await headers()
  const referer = headersList.get('referer')

  let data
  if( CONTENT_TYPE === 'dealer' ){
    data = await fetchGQL(QueryDealersWithRegion)
  }

  const formattedDealerList = data?.dealerRegions?.nodes?.reduce((acc:any, node:any)=>{
    return [
      ...acc,
      ...(node?.dealers?.nodes?.map?.((dealerNode:any)=>{
        return {
          ...(dealerNode || {})
        }
      }) || [])
    ]
  }, [])
  return <>
    <Form lang={lang} referer={referer}>
      {
        CONTENT_TYPE === 'dealer' && <div className="mt-10 bg-major-900 py-20 text-white">
          <div className="container">
            <div className="serif mb-14 text-center text-[32px] font-300 text-white lg:mb-20">
              <T text="Personal and Virtual Tours <i>available.</i>" />
            </div>
          </div>

          <div className="container">
            <div className="row">
              {
                formattedDealerList?.map?.((dealerNode:any, index:number)=>{
                  return <div className="lg:col-6 col-12 mb-10" key={index}>
                    <div className="text-[14px] text-gray-100">{ dealerNode?.dealerRegions?.nodes?.[0]?.name }</div>
                    <div className="mb-1 flex flex-nowrap items-center">
                      <div className="shrink text-[20px] text-golden-700">{ dealerNode?.title }</div>
                      {
                        dealerNode?.dealerCustomFields?.website && <a className="btn-opacity ml-2 mt-0.5 text-golden-500" href={dealerNode?.dealerCustomFields?.website}>
                          <T text="Website" />
                        </a>
                      }
                      {
                        dealerNode.dealerCustomFields?.googleMapLink && <a className="btn-opacity ml-2 mt-0.5 text-golden-500" href={dealerNode.dealerCustomFields.googleMapLink} target="_blank">
                          <T text="Map" />
                        </a>
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
          </div>
        </div>
      }
    </Form>
  </>
}

export default PageContact