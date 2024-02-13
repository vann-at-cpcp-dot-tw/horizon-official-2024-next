'use client'

import ReactDOM from 'react-dom'

interface TypeProps {
  children: React.ReactNode
  dom: HTMLElement
}

function Portal(props:TypeProps){
  return ReactDOM.createPortal(
    props.children,
    props.dom
  )
}

export default Portal