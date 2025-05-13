import React, { useState, useEffect, useCallback } from "react";
import { DialogTitle } from "@headlessui/react";
import ModalWrapper from "../ModalWrapper";
import Button from "../Button";
import clsx from "clsx";
import { useForm, Controller } from "react-hook-form"; // Importa Controller
import {
  createTicket,
  listDepartamentos,
  listAllIncidencias,
  listAllPrioridades,
  listAllMotivos, // Necesitamos una nueva función en el servicio
  // listIncidenciasBydepartamento // Opcional: si prefieres cargar bajo demanda
} from "../../services/TicketService"; // Asume que crearás listAllIncidencias
import { getUserId, listUsers } from "../../services/UsuarioService";
import { toast } from "sonner";
// const PRIORITIES = ["Baja", "Media", "Alta"];

export default function CreateTicket({ open, setOpen, refreshTickets, id}) {
  const [loading, setLoading] = useState(false);
  const [loadingDeps, setLoadingDeps] = useState(false);
  const [loadingIncs, setLoadingIncs] = useState(false);
  const [departamentos, setDepartamentos] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [motivos, setMotivos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioCreador, setUsuarioCreador] = useState();
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [allIncidencias, setAllIncidencias] = useState([]); // Guarda todas las incidencias
  // const { isAuth, getAllUsers } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    control, // Necesario para Controller
    watch, // Para observar cambios en los campos
    setValue, // Para establecer valores programáticamente
    formState: { errors },
  } = useForm({
    defaultValues: {
      // Establece valores iniciales
      tema: "",
      fechaVencimiento:"",
      descripcion: "",
      usuarioCreador: "",
      usuarioAsignado: "",
      departamento: "",
      fuente: "",
      incidencia: "",
      motivo: "",
      estado: "",
      prioridad: "", // Estandarizado a prioridad
    },
  });
  // Incidencias filtradas basadas en el departamento seleccionado
  const [filteredIncidencias, setFilteredIncidencias] = useState([]);

  // Observa los cambios en los selects
  const watcheddepartamento = watch("departamento");
  const watchedincidencia = watch("incidencia");

  // --- Carga Inicial de Datos ---
  const loadInitialData = useCallback(async () => {
    setLoadingDeps(true);
    setLoadingIncs(true);
    try {
      const [depRes, incRes, prioRes, motRes, userRes,userCRes] = await Promise.all([
        listDepartamentos(),
        listAllIncidencias(), // Llama a la nueva función del servicio
        listAllPrioridades(),
        listAllMotivos(),
        listUsers(), // Asume que lista todos los usuarios relevantes
        getUserId(),
      ]);

      // Asume que depRes.data es [{ id, nombre }]
      setDepartamentos(depRes.data || []);
      setPrioridades(prioRes.data || []);
      // Asume que incRes.data es [{ id, nombre, departamento: { id, nombre } }]
      // Mapeamos para tener una estructura plana si es necesario, o usamos la anidada
      setAllIncidencias(incRes.data || []);
      setMotivos(motRes.data || []);
      setUsuarios(userRes.data || []);
      setUsuarioCreador(userCRes.data || [])
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error);
      toast.error("Error al cargar datos. Contacte a sistemas.");
      // Opcional: cerrar modal si falla la carga esencial
      // closeDialog();
    } finally {
      setLoadingDeps(false);
      setLoadingIncs(false);
    }
  }, []); // Sin dependencias, se llama una vez

  useEffect(() => {
    if (open) {
      loadInitialData();
    } else {
      // Resetea estados cuando se cierra el modal para evitar datos viejos
      setDepartamentos([]);
      setAllIncidencias([]);
      setFilteredIncidencias([]);
    }
  }, [open, loadInitialData]);

  // --- Lógica de Selects Dependientes y Auto-asignación ---

  // Efecto para filtrar incidencias y usuarios cuando cambia el departamento seleccionado
  useEffect(() => {
    if (watcheddepartamento) {
      const deptId = parseInt(watcheddepartamento, 10);
      // Filtra incidencias que pertenecen al departamento seleccionado
      const filteredInc = allIncidencias.filter(
        (inc) => inc.departamento?.id === deptId
      );
      // Filtra usuarios que pertenecen al departamento seleccionado (si aplica esa lógica)
      const filteredUsers = usuarios.filter(
        (user) => user.departamento?.id === deptId
      );
      setFilteredIncidencias(filteredInc);
      setFilteredUsuarios(filteredUsers);
      // Podríamos resetear incidencia si el departamento cambia y la incidencia actual no pertenece al nuevo
      // setValue("incidencia", "", { shouldValidate: false }); // Descomentar si se desea este comportamiento
    } else {
      setFilteredIncidencias([]); // Limpia si no hay departamento seleccionado
    }
  }, [watcheddepartamento, allIncidencias, usuarios]);

  // Efecto para auto-asignar departamento cuando cambia la incidencia seleccionada
  useEffect(() => {
    if (watchedincidencia) {
      const incId = parseInt(watchedincidencia, 10);
      const selectedIncidencia = allIncidencias.find((inc) => inc.id === incId);

      if (selectedIncidencia?.departamento) {
        const targetdepartamento =
          selectedIncidencia.departamento.id.toString(); // Asegura que sea string para el <select>
        const currentdepartamento = watcheddepartamento;

        // Solo actualiza si el departamento asociado a la incidencia es diferente al seleccionado actualmente
        if (currentdepartamento !== targetdepartamento) {
          setValue("departamento", targetdepartamento, {
            shouldValidate: true,
          });
          // El efecto anterior (watcheddepartamento) se encargará de re-filtrar las incidencias
        }

        // Lógica específica para asignar automáticamente "Sistemas" (si es necesario)
        // Esta parte del requerimiento original ("cuando se seleccione una incidencia del departamento de sistemas, se asigne automaticamente el departamento")
        // ya está cubierta por la lógica general anterior. Si una incidencia pertenece a Sistemas,
        // se seleccionará Sistemas en el dropdown de departamento.
      }
    }
    // No añadir setValue a las dependencias para evitar bucles infinitos
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedincidencia, allIncidencias]); // Solo depende de la incidencia y la lista completa

  const closeDialog = () => {
    reset(); // Limpia react-hook-form
    setFilteredIncidencias([]); // Limpia estado local
    setOpen(false);
  };

  const handleFormSubmit = async (data) => {    
    setLoading(true);
    try {
      const ticketData = {
        tema: data.tema,
        fechaVencimiento: data.fechaVencimiento,
        descripcion: data.descripcion,
        usuarioCreador: parseInt(usuarioCreador),//
        usuarioAsignado: parseInt(data.usuarioAsignado),
        departamento: parseInt(data.departamento),
        fuente: 1,//  
        incidencia: parseInt(data.incidencia),
        motivo: parseInt(data.motivo),//
        estado: 3,//
        prioridad: parseInt(data.prioridad),
      };
      console.log("Enviando datos del Ticket:", ticketData);

      await createTicket(ticketData);
      toast.success("Ticket creado exitosamente.");
      if (refreshTickets) {
        refreshTickets();
      }
      closeDialog();
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      const errorMsg =
        error.response?.data?.message || "Error al crear el ticket.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  const isLoadingData = loadingDeps || loadingIncs;

  return (
    // Usa el ModalWrapper refactorizado, pasando title y footer como props
    <ModalWrapper
      open={open}
      setOpen={closeDialog}
      title={
        // El título se pasa como un elemento React
        <DialogTitle
          as="h2"
          // El ID debe coincidir con el aria-labelledby en ModalWrapper si se genera allí
          // Si ModalWrapper genera el ID, no es necesario ponerlo aquí.
          // id={titleId} // Asegúrate que titleId esté definido si lo pones aquí
          className="text-lg font-semibold leading-6 text-gray-900 text-center"
        >
          Crear Nuevo Ticket
        </DialogTitle>
      }
      footer={
        // Los botones se pasan como un elemento React en el footer
        <div className="sm:flex sm:flex-row-reverse gap-4">
          <Button
            type="submit" // Sigue siendo submit
            form="create-ticket-form" // Vincula este botón al formulario por su ID
            className={clsx(
              "px-8 text-sm font-semibold text-white sm:w-auto",
              "bg-blue-600 hover:bg-blue-700",
              (loading || isLoadingData) && "opacity-50 cursor-not-allowed"
            )}
            label={loading ? "Creando..." : "Crear Ticket"}
            onClick={handleSubmit(handleFormSubmit)}
            disabled={loading || isLoadingData}
          />
          <Button
            type="button"
            className="bg-white px-8 text-sm font-semibold text-gray-900 sm:w-auto border hover:bg-gray-50"
            onClick={() => closeDialog()}
            label="Cancelar"
            disabled={loading} // Deshabilitar si el formulario está enviando
          />
        </div>
      }
    >
      {/* El formulario ahora solo envuelve los campos (children del ModalWrapper) */}
      {/* Se le da un ID para vincularlo con el botón de submit externo */}
      <form id="create-ticket-form" className="w-full">
        <div className="flex flex-col gap-4">
          {" "}
          {/* Contenedor para los campos con espaciado */}
          {/* Campo Título */}
          <div className="w-full">
            <label
              htmlFor="tema"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Título
            </label>
            <input
              type="text"
              id="tema"
              {...register("tema", { required: "El título es obligatorio" })}
              placeholder="Título del ticket"
              className={clsx(
                "w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                errors.tema && "border-red-500"
              )}
            />
            {errors.tema && (
              <p className="text-red-500 text-xs mt-1">{errors.tema.message}</p>
            )}
          </div>
          {/* Campo Descripción */}
          <div className="w-full">
            <label
              htmlFor="descripcion"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descripción
            </label>
            <textarea
              id="descripcion"
              rows={4}
              maxLength={500}
              {...register("descripcion", {
                required: "La descripción es obligatoria",
              })}
              placeholder="Describe el problema o solicitud"
              className={clsx(
                "w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                errors.descripcion && "border-red-500"
              )}
            />
            {errors.descripcion && (
              <p className="text-red-500 text-xs mt-1">
                {errors.descripcion.message}
              </p>
            )}
          </div>
         {/* Campo Motivo*/}
         <div className="w-full">
            <label
              htmlFor="fechaVencimiento"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fecha de vencimiento:
            </label>{" "}
            <Controller
              name="fechaVencimiento" // Corregido name
              control={control}
              rules={{ required: "La fecha es obligatoria" }}
              render={({ field }) => (
                <input type="date" id="fechaVencimiento" {...field}/>
              )}
            />
            {errors.fechaVencimiento && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fechaVencimiento.message}
              </p>
            )}{" "}
            {/* Corregido error check */}
          </div>
          
          {/* Campo Usuario (Agente Asignado) */}
          <div className="w-full">
            <label
              htmlFor="usuarioAsignado"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Agente:
            </label>
            <Controller
              name="usuarioAsignado"
              control={control}
              rules={{ required: "El agente es obligatorio" }} // Mensaje de error más específico
              render={({ field }) => (
                <select
                  id="usuarioAsignado"
                  {...field}
                  className={clsx(
                    "w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                    errors.usuarioAsignado && "border-red-500"
                  )}
                >
                  <option value="" disabled>
                    {loadingDeps ? "Cargando..." : "Selecciona un agente"}
                  </option>
                  {/* Idealmente, aquí se mostrarían los filteredUsuarios si la lógica aplica */}
                  {/* Si no, se muestran todos los usuarios */}
                  {(filteredUsuarios.length > 0
                    ? filteredUsuarios
                    : usuarios
                  ).map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombre}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.usuarioAsignado && (
              <p className="text-red-500 text-xs mt-1">
                {errors.usuarioAsignado.message}
              </p>
            )}
          </div>
          {/* Campo Departamento */}
          <div className="w-full">
            <label
              htmlFor="departamento"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Departamento
            </label>
            <Controller
              name="departamento"
              control={control}
              rules={{ required: "El departamento es obligatorio" }}
              render={({ field }) => (
                <select
                  id="departamento"
                  {...field}
                  disabled={loadingDeps || loading} // Deshabilitado mientras carga o envía
                  className={clsx(
                    "w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                    errors.departamento && "border-red-500"
                  )}
                >
                  <option value="" disabled>
                    {loadingDeps ? "Cargando..." : "Selecciona un departamento"}
                  </option>
                  {departamentos.map((dep) => (
                    <option key={dep.id} value={dep.id}>
                      {dep.nombre}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.departamento && (
              <p className="text-red-500 text-xs mt-1">
                {errors.departamento.message}
              </p>
            )}
          </div>
          {/* Campo Incidencia */}
          <div className="w-full">
            <label
              htmlFor="incidencia"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Incidencia
            </label>
            <Controller
              name="incidencia"
              control={control}
              rules={{ required: "La incidencia es obligatoria" }}
              render={({ field }) => (
                <select
                  id="incidencia"
                  {...field}
                  disabled={
                    !watcheddepartamento ||
                    loadingIncs ||
                    loadingDeps ||
                    loading
                  }
                  className={clsx(
                    "w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                    errors.incidencia && "border-red-500",
                    (!watcheddepartamento || loadingIncs) &&
                      "bg-gray-100 cursor-not-allowed"
                  )}
                >
                  <option value="" disabled>
                    {!watcheddepartamento
                      ? "Selecciona un departamento primero"
                      : loadingIncs
                      ? "Cargando incidencias..."
                      : filteredIncidencias.length === 0
                      ? "No hay incidencias para este depto."
                      : "Selecciona una incidencia"}
                  </option>
                  {filteredIncidencias.map((inc) => (
                    <option key={inc.id} value={inc.id}>
                      {inc.nombre}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.incidencia && (
              <p className="text-red-500 text-xs mt-1">
                {errors.incidencia.message}
              </p>
            )}
          </div>

          {/* Campo Motivo*/}
          <div className="w-full">
            <label
              htmlFor="motivo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Motivo:
            </label>{" "}
            <Controller
              name="motivo" // Corregido name
              control={control}
              rules={{ required: "El motivo es obligatorio" }}
              render={({ field }) => (
                <select
                  id="motivo" // Corregido id
                  {...field}
                  className={clsx(
                    "w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                    errors.motivo && "border-red-500"
                  )} // Corregido error check
                >
                  <option value="" disabled>
                    {loadingDeps ? "Cargando..." : "Asigne el motivo"}
                  </option>
                  {/* Asume que motivo es [{id, nombre}] */}
                  {motivos.map((mot) => (
                    <option key={mot.id} value={mot.id}>
                      {mot.nombre}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.motivo && (
              <p className="text-red-500 text-xs mt-1">
                {errors.motivo.message}
              </p>
            )}{" "}
            {/* Corregido error check */}
          </div>
          {/* Campo Prioridad*/}
          <div className="w-full">
            <label
              htmlFor="prioridad"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Prioridad:
            </label>{" "}
            <Controller
              name="prioridad" // Corregido name
              control={control}
              rules={{ required: "La prioridad es obligatoria" }}
              render={({ field }) => (
                <select
                  id="prioridad" // Corregido id
                  {...field}
                  className={clsx(
                    "w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                    errors.prioridad && "border-red-500"
                  )} // Corregido error check
                >
                  <option value="" disabled>
                    {loadingDeps ? "Cargando..." : "Asigne la prioridad"}
                  </option>
                  {/* Asume que prioridades es [{id, nombre}] */}
                  {prioridades.map((prio) => (
                    <option key={prio.id} value={prio.id}>
                      {prio.nombre}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.prioridad && (
              <p className="text-red-500 text-xs mt-1">
                {errors.prioridad.message}
              </p>
            )}{" "}
            {/* Corregido error check */}
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
}

// Código original de los botones (para referencia)
/*
<div className="bg-gray-50 py-3 mt-4 sm:flex sm:flex-row-reverse gap-4 px-4">
                        <Button
                            type="submit"
                            className={clsx("px-8 text-sm font-semibold text-white sm:w-auto", "bg-blue-600 hover:bg-blue-700", (loading || isLoadingData) && "opacity-50 cursor-not-allowed")}
                            label={loading ? "Creando..." : "Crear Ticket"}
                            disabled={loading || isLoadingData}
                        />
                        <Button
                            type="button"
                            className="bg-white px-8 text-sm font-semibold text-gray-900 sm:w-auto border hover:bg-gray-50"
                            onClick={() => closeDialog()}
                            label="Cancelar"
                            disabled={loading}
                        />
</div>
*/
