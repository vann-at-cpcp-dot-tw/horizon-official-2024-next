import { useReducer, useState } from 'react'

export default function useForm<T>(api:string, defaultForm:T){


  const [loading, setLoading] = useState(false)
  const [form, setForm] = useReducer((state:T, updateState:Partial<T>)=>({...state, ...updateState}), defaultForm)

  async function handleSubmit(form:{[key:string]:any}){
    if( loading ){
      return
    }

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