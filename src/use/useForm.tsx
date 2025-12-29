import { useReducer, useState, useRef } from 'react'

export default function useForm<T>(api:string, defaultForm:T){

  const [loading, setLoading] = useState(false)
  const isSubmitting = useRef(false)
  const [form, setForm] = useReducer((state:T, updateState:Partial<T>)=>({...state, ...updateState}), defaultForm)

  async function handleSubmit(form:{[key:string]:any}){
    if( isSubmitting.current ){
      return
    }
    isSubmitting.current = true
    setLoading(true)

    const formData = new FormData()
    for (let key in form) {
      formData.append(key,form[key])
    }
    const res = await fetch(api, {
      method: "POST",
      body: formData,
    })
    const json = await res.json()

    isSubmitting.current = false
    setLoading(false)
    return json
  }

  return {
    form,
    setForm,
    loading,
    handleSubmit,
  }
}