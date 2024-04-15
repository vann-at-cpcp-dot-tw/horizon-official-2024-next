
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/helpers'
import { redirect } from "next/navigation"
import { QueryTeamPage } from '~/queries/pages/team.gql'
import { fetchGQL } from '~/lib/apollo'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'

interface TypeProps {
  params: {
    lang: string
  }
}

interface TypeState {}

async function PageTeam({params}:TypeProps){

  const { lang } = params
  const data = await fetchGQL(QueryTeamPage)

  if( CONTENT_TYPE === 'hq '){
    redirect('/')
  }

  return <main className="pb-24">

    <div className="container serif my-10 text-center text-[32px] text-minor-900">{data?.teamPageSettings?.teamPageCustomFields?.pageTitle}</div>

    <div className="MCE-CONTENT container" style={{maxWidth:'940px'}} dangerouslySetInnerHTML={{__html:data?.teamPageSettings?.teamPageCustomFields?.teamIntroduction}}></div>

    {
      data?.teamPageSettings?.teamPageCustomFields?.teamMembers?.length > 0 && <div className="container py-24" style={{maxWidth:'1240px'}}>
        <div className="row xl:row-gap-8 justify-center">
          {
            data?.teamPageSettings?.teamPageCustomFields?.teamMembers?.map((node:{[key:string]:any}, index:number)=>{
              return <div className="lg:col-3 col-12" key={index}>
                <RatioArea className="mb-3" ratio="114.28">
                  <Image className="absolute left-0 top-0 size-full" src={node?.image?.node?.mediaItemUrl || ''} fill={true} alt="" />
                </RatioArea>

                <div className="mb-2 text-[24px] text-gray-900">{node?.name}</div>
                <hr className="border-gray-500" />
                {
                  node?.subtitle && <div className="text-gray-500">{ node?.subtitle }</div>
                }
                {
                  node?.contactEmail && <div className="text-gray-500"><a href={`mailto:${node.contactEmail}`}>{node.contactEmail}</a></div>
                }
              </div>
            })
          }
        </div>
      </div>
    }

  </main>
}

export default PageTeam