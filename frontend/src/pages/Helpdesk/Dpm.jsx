import { Transition } from "@headlessui/react";
import React from "react";
import { useParams } from "react-router-dom";
import { listAllDepartamentos } from "../../services/DepartamentoService";
import { listAllPrioridades } from "../../services/PrioridadService";
import { listAllMotivos } from "../../services/MotivoService";

//Se crea esta clase debido a que DPM se desglosa de esta manera{*Departamento, prioridades y motivos*}.
//Elegí hacerlo de esta manera para reutilizar el componente y no hacer más codigo que será igual.
//Las entidades unicamente cuentan con Id y Nombre.
export const Dpm = () => {
  const ruta = useParams();
  if (ruta.ruta === "departamentos") {
    listAllDepartamentos();
  } else if (ruta.ruta === "prioridades") {
    listAllPrioridades();
  } else if (ruta.ruta === "motivos") {
    listAllMotivos();
  }
  return (
    <Transition
      as="div"
      appear
      show
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      className=""
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">xd</h2>
      </div>
    </Transition>
  );
};
