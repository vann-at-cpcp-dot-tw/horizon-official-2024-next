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
        <div>Bienvenido,</div>
        <div>Gracias por visitar la página web de Horizon Yachts.</div>
        <div>Estamos trabajando duro para ofrecerle la versión española de nuestra web. Pronto estará disponible.</div>
        <div>Mientras tanto, por favor, explore la página en inglés.</div>
        <br/>
        <div>¡Gracias por su paciencia!</div>
      </div>
      <div className="flex justify-center">
        <Link className="btn-text" href="/">Volver a Inicio</Link>
      </div>
    </div>
  </main>
}

export default PageNotFound