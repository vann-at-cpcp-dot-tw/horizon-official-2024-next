const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { isEmpty } from '@src/lib/helpers'
import { QuerySinglePost, QueryPrevPosts, QueryNextPosts  } from '@src/queries/pages/news-[categorySlug]-[postSlug].gql'
import { fetchGQL } from "@src/lib/apollo"
import Breadcrumb from "@src/components/custom/Breadcrumb"
import PostSwiper from "./(templates)/PostSwiper"
import RelatedPosts from "../../(templates)/RelatedPosts"
import { genImageBlurHash } from "@src/lib/genImageBlurHash"

interface TypeProps {
  params: {
    [key:string]: string
  }
}
interface TypeState {}

async function PageSinglePost({params}:TypeProps){

  const { lang, categorySlug, postSlug } = params
  const data = await fetchGQL(QuerySinglePost, {
    variables: {
      categorySlug,
      postSlug
    }
  })
  const post = data?.category?.posts?.nodes?.[0]
  const galleryWithPlaceholder = await Promise.all(
    post?.postCustomFields?.gallery?.map?.(async (node:any) => {
      const base64 = await genImageBlurHash(node?.image?.node?.mediaItemUrl)
      return {
        ...node,
        placeholder: base64,
      }
    }) || []
  )

  return <main className="relative pb-[60px]">
    <Breadcrumb className="pb-5 pt-2.5 lg:pt-10"
    list={[
      {
        label: 'News',
        href: '/news'
      },
      ...(
        post?.categories?.nodes?.[0]?.slug
          ?[{
            label: post?.categories?.nodes?.[0]?.name,
            href: `/news/${post?.categories?.nodes?.[0]?.slug}`
          }]
          :[]
      ),
      {
        label: post?.title,
      }
    ]} />

    <div className="container mb-6 mt-2 text-center lg:my-8">
      <div className="serif mb-2 text-center text-[28px] leading-[1.4] text-major-900 lg:text-[32px]">{ post?.title }</div>
      <div className="text-[14px] text-gray-500">{ (post?.date || '').slice(0, 10).replaceAll('-', '.') }</div>
    </div>

    <div className="container mb-10" style={{ maxWidth:'940px' }}>
      <PostSwiper gallery={galleryWithPlaceholder} />
    </div>

    <div className="MCE-CONTENT mb-10">
      <div className="container" style={{ maxWidth:'940px' }}>
        <div className="mx-auto w-full" dangerouslySetInnerHTML={{__html:post?.content || ''}}></div>
      </div>
    </div>

    <div className="container pb-5 text-center">
      <LinkWithLang href="/news" lang={lang}>
        <span className="btn-text text-gray-700">Back to News</span>
      </LinkWithLang>
    </div>

    <div className="container">
      <hr className="my-10 border-gray-500" />
    </div>

    <RelatedPosts categorySlug={categorySlug} postCursor={data?.category?.posts?.pageInfo?.endCursor} />

  </main>
}

export default PageSinglePost