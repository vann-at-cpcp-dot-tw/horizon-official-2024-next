
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/helpers'
import { QuerySingleDealer } from '~/queries/pages/dealers.gql'
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
  let dealer
  if( CONTENT_TYPE === 'dealer' ){
    data = await fetchGQL(QuerySingleDealer)
    dealer = data?.dealers?.nodes?.[0]
  }

  return <>
    <Form lang={lang} referer={referer}>
      {
        dealer?.title && <div className="mt-10 bg-major-900 py-20 text-white">
          <div className="container">
            <div className="item mb-8">
              <div className="flex flex-nowrap items-center justify-center">
                <div className="serif mb-1 shrink text-[24px] text-white lg:text-[32px]">{ dealer.title }</div>
                {
                  dealer.dealerCustomFields?.address && <a className="btn-text -mt-2.5 ml-4 text-[13px] font-300 text-white lg:ml-4 lg:text-[15px]" href={`https://www.google.com/maps/search/${encodeURI(dealer.dealerCustomFields?.address)}`} target="_blank">map</a>
                }
              </div>
              {
                dealer?.dealerCustomFields?.contactNumber && <div className="mb-2 text-center text-[14px] font-300 lg:text-[16px]">
                  <a href={`tel:${dealer.dealerCustomFields.contactNumber.replace(' ', '').replace('-', '')}`}>{ dealer.dealerCustomFields.contactNumber }</a>
                </div>
              }
              {
                dealer?.dealerCustomFields?.contactEmail && <div className="mb-2 text-center text-[14px] font-300 lg:text-[16px]">
                  <a href={`mailto:${dealer.dealerCustomFields.contactEmail}`}>{dealer.dealerCustomFields.contactEmail}</a>
                </div>
              }
              {
                dealer.dealerCustomFields?.address && <div className="mb-2 text-center text-[14px] font-300 lg:text-[16px]">{dealer.dealerCustomFields?.address}</div>
              }
            </div>
          </div>
        </div>
      }
    </Form>
  </>
}

export default PageContact