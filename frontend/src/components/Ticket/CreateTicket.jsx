import React, { useState, useEffect, useCallback } from "react";
import { Dialog } from "@headlessui/react";
import ModalWrapper from "../ModalWrapper";
import Button from "../Button";
import clsx from "clsx";
import { useForm, Controller } from "react-hook-form"; // Importa Controller
import {
    createTicket,
    listDepartamentos,
    listAllIncidencias, // Necesitamos una nueva función en el servicio
    // listIncidenciasByDepartamentoId // Opcional: si prefieres cargar bajo demanda
} from "../../services/TicketService"; // Asume que crearás listAllIncidencias
import { toast } from "sonner";

const PRIORITIES = ["Baja", "Media", "Alta"];

export default function CreateTicket({ open, setOpen, refreshTickets }) {
    const [loading, setLoading] = useState(false);
    const [loadingDeps, setLoadingDeps] = useState(false);
    const [loadingIncs, setLoadingIncs] = useState(false);
    const [departamentos, setDepartamentos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [allIncidencias, setAllIncidencias] = useState([]); // Guarda todas las incidencias
    const [filteredIncidencias, setFilteredIncidencias] = useState([]); // Incidencias filtradas para el select

    const {
        register,
        handleSubmit,
        reset,
        control, // Necesario para Controller
        watch,   // Para observar cambios en los campos
        setValue,// Para establecer valores programáticamente
        formState: { errors },
    } = useForm({
        defaultValues: { // Establece valores iniciales
            tema: "",
            usuarioAsignado: "",
            usuarioCreador: "",
            descripcion: "",
            departamentoId: "",
            incidenciaId: "",
            motivo: "",
            estado: "",
            prioridad: "",
            
        }
    });

    // Observa los cambios en los selects
    const watchedDepartamentoId = watch("departamentoId");
    const watchedIncidenciaId = watch("incidenciaId");

    // --- Carga Inicial de Datos ---
    const loadInitialData = useCallback(async () => {
        setLoadingDeps(true);
        setLoadingIncs(true);
        try {
            const [depRes, incRes] = await Promise.all([
                listDepartamentos(),
                listAllIncidencias() // Llama a la nueva función del servicio
            ]);

            // Asume que depRes.data es [{ id, nombre }]
            setDepartamentos(depRes.data || []);

            // Asume que incRes.data es [{ id, nombre, departamento: { id, nombre } }]
            // Mapeamos para tener una estructura plana si es necesario, o usamos la anidada
            setAllIncidencias(incRes.data || []);

        } catch (error) {
            console.error("Error al cargar datos iniciales:", error);
            toast.error("Error al cargar departamentos o incidencias.");
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

    // Efecto para filtrar incidencias cuando cambia el departamento seleccionado
    useEffect(() => {
        if (watchedDepartamentoId) {
            const deptId = parseInt(watchedDepartamentoId, 10);
            const filtered = allIncidencias.filter(inc => inc.departamento?.id === deptId);
            setFilteredIncidencias(filtered);
            
            // No reseteamos incidencia aquí para permitir la auto-asignación desde incidencia
        } else {
            setFilteredIncidencias([]); // Limpia si no hay departamento seleccionado
        }
    }, [watchedDepartamentoId, allIncidencias]);

    // Efecto para auto-asignar departamento cuando cambia la incidencia seleccionada
    useEffect(() => {
        if (watchedIncidenciaId) {
            const incId = parseInt(watchedIncidenciaId, 10);
            const selectedIncidencia = allIncidencias.find(inc => inc.id === incId);

            if (selectedIncidencia?.departamento) {
                const targetDepartamentoId = selectedIncidencia.departamento.id.toString(); // Asegura que sea string para el select
                const currentDepartamentoId = watchedDepartamentoId;

                // Solo actualiza si el departamento es diferente para evitar bucles
                if (currentDepartamentoId !== targetDepartamentoId) {
                    setValue("departamentoId", targetDepartamentoId, { shouldValidate: true });
                    // El efecto anterior (watchedDepartamentoId) se encargará de re-filtrar las incidencias
                }

                // Lógica específica para asignar automáticamente "Sistemas" (si es necesario)
                // Esta parte del requerimiento original ("cuando se seleccione una incidencia del departamento de sistemas, se asigne automaticamente el departamento")
                // ya está cubierta por la lógica general anterior. Si una incidencia pertenece a Sistemas,
                // se seleccionará Sistemas en el dropdown de departamento.

            }
        }
        // No añadir setValue a las dependencias para evitar bucles infinitos
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchedIncidenciaId, allIncidencias]); // Solo depende de la incidencia y la lista completa

    useEffect(() => {
        const fetchUsers = async () => {
          await getAllUsers();
        };
    
        if (isAuth) fetchUsers();
      }, [isAuth]);

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
                descripcion: data.descripcion,
                prioridad: data.prioridad,
                // Asegúrate de que el backend espera los IDs directamente o como objetos
                // Opción 1: IDs directos (más simple si el backend los acepta)
                departamentoId: parseInt(data.departamentoId),
                incidenciaId: parseInt(data.incidenciaId),
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
            const errorMsg = error.response?.data?.message || "Error al crear el ticket.";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const isLoadingData = loadingDeps || loadingIncs;

    return (
        <>
            <ModalWrapper open={open} setOpen={closeDialog}>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full">
                    <Dialog.Title
                        as="h2"
                        className="text-lg font-semibold leading-6 text-gray-900 mb-4 text-center"
                    >
                        Crear Nuevo Ticket
                    </Dialog.Title>

                    <div className="mt-2 flex flex-col gap-4 px-4">
                        {/* Campo Título */}
                        <div className="w-full">
                            <label htmlFor="tema" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                            <input
                                type="text" id="tema"
                                {...register("tema", { required: "El título es obligatorio" })}
                                placeholder="Título del ticket"
                                className={clsx("w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", errors.tema && "border-red-500")}
                            />
                            {errors.tema && <p className="text-red-500 text-xs mt-1">{errors.tema.message}</p>}
                        </div>

                        {/* Campo Descripción */}
                        <div className="w-full">
                            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <textarea id="descripcion" rows={3}
                                {...register("descripcion", { required: "La descripción es obligatoria" })}
                                placeholder="Describe el problema o solicitud"
                                className={clsx("w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", errors.descripcion && "border-red-500")}
                            />
                            {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion.message}</p>}
                        </div>

                        {/* Campo Usuario */}
                        <div className="w-full">
                            <label htmlFor="usuarioAsignado" className="block text-sm font-medium text-gray-700 mb-1">Agente:</label>
                            {/* Usamos Controller para integrar mejor con setValue */}
                            <Controller
                                name="usuarioAsignado"
                                control={control}
                                rules={{ required: "El usuario es obligatorio" }}
                                render={({ field }) => (
                                    <select id="usuarioAsignado"
                                        {...field} // Pasa props de react-hook-form (value, onChange, onBlur)
                                        disabled={loadingDeps || loading}
                                        className={clsx("w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", errors.usuarioAsignado && "border-red-500")}
                                    >
                                        <option value="" disabled>{loadingDeps ? "Cargando..." : "Selecciona un agente"}</option>
                                        {departamentos.map((dep) => (<option key={dep.id} value={dep.id}>{dep.nombre}</option>))}
                                    </select>
                                )}
                            />
                            {errors.departamentoId && <p className="text-red-500 text-xs mt-1">{errors.departamentoId.message}</p>}
                        </div>
                        {/* Campo Departamento */}
                        <div className="w-full">
                            <label htmlFor="departamentoId" className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                            <Controller
                                name="departamentoId"
                                control={control}
                                rules={{ required: "El departamento es obligatorio" }}
                                render={({ field }) => (
                                    <select id="departamentoId"
                                        {...field} // Pasa props de react-hook-form (value, onChange, onBlur)
                                        disabled={loadingDeps || loading}
                                        className={clsx("w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", errors.departamentoId && "border-red-500")}
                                    >
                                        <option value="" disabled>{loadingDeps ? "Cargando..." : "Selecciona un departamento"}</option>
                                        {departamentos.map((dep) => (<option key={dep.id} value={dep.id}>{dep.nombre}</option>))}
                                    </select>
                                )}
                            />
                            {errors.departamentoId && <p className="text-red-500 text-xs mt-1">{errors.departamentoId.message}</p>}
                        </div>

                        {/* Campo Incidencia */}
                        <div className="w-full">
                            <label htmlFor="incidenciaId" className="block text-sm font-medium text-gray-700 mb-1">Incidencia</label>
                            <Controller
                                name="incidenciaId"
                                control={control}
                                rules={{ required: "La incidencia es obligatoria" }}
                                render={({ field }) => (
                                    <select id="incidenciaId"
                                        {...field}
                                        // Deshabilitado si no hay departamento seleccionado o si se están cargando datos
                                        disabled={!watchedDepartamentoId || loadingIncs || loadingDeps || loading}
                                        className={clsx("w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", errors.incidenciaId && "border-red-500", (!watchedDepartamentoId || loadingIncs) && "bg-gray-100")}
                                    >
                                        <option value="" disabled>
                                            {!watchedDepartamentoId
                                                ? "Selecciona un departamento primero"
                                                : loadingIncs
                                                    ? "Cargando incidencias..."
                                                    : filteredIncidencias.length === 0
                                                        ? "No hay incidencias para este depto."
                                                        : "Selecciona una incidencia"}
                                        </option>
                                        {filteredIncidencias.map((inc) => (<option key={inc.id} value={inc.id}>{inc.nombre}</option>))}

                                    </select>
                                )}
                            />
                            {errors.incidenciaId && <p className="text-red-500 text-xs mt-1">{errors.incidenciaId.message}</p>}
                        </div>

                        {/* Campo Prioridad */}
                        <div className="w-full">
                            <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                            <select id="prioridad"
                                {...register("prioridad", { required: "La prioridad es obligatoria" })}
                                className={clsx("w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", errors.prioridad && "border-red-500")}
                                defaultValue="" // Asegura que el placeholder se muestre
                            >
                                <option value="" disabled>Selecciona una prioridad</option>
                                {PRIORITIES.map((p) => (<option key={p} value={p}>{p}</option>))}
                            </select>
                            {errors.prioridad && <p className="text-red-500 text-xs mt-1">{errors.prioridad.message}</p>}
                        </div>
                    </div>

                    {/* Botones */}
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
                </form>
            </ModalWrapper>
        </>
    );
}