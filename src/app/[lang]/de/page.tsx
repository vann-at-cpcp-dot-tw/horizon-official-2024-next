import Link from "next/link"
interface TypeProps {
  params: {
    lang: string
  }
}
interface TypeState {}

function PageNotFound({params}:TypeProps){

  return <main className="flex grow flex-col justify-center py-24">
    <div className="container">
      <div className="serif text-center text-[28px] text-major-900 lg:text-[32px]">404</div>
      <div className="serif py-6 text-center text-[24px] italic text-major-900 lg:py-8 lg:text-[32px]">
        <div>Hallo!</div>
        <div>Vielen Dank für Ihren Besuch auf der Horizon Yachts Website!</div>
        <div>Wir arbeiten hart daran, Ihnen die deutsche Version unserer Website zu präsentieren. Diese wird bald verfügbar sein.</div>
        <div>In der Zwischenzeit erkunden Sie bitte unsere Website auf Englisch.</div>
        <br/>
        <div>Wir danken Ihnen für Ihre Geduld!</div>
      </div>
      <div className="flex justify-center">
        <Link className="btn-text" href="/">Zurück nach Hause</Link>
      </div>
    </div>
  </main>
}

export default PageNotFound