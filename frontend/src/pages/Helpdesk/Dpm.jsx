import React from 'react'
import { useParams } from 'react-router-dom'


//Se crea esta clase debido a que DPM se desglosa de esta manera{*Departamento, prioridades y motivos*}. 
//Elegí hacerlo de esta manera para reutilizar el componente y no hacer más codigo que será igual.
//Las entidades unicamente cuentan con Id y Nombre.
export const Dpm = () => {
  const ruta = useParams()
  console.log(ruta)
  return (
    <div>{}</div>
  )
}
