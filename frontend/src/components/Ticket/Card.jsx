import clsx from "clsx";
import React, { useState } from "react";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import {
  BGS,
  PRIOTITYSTYELS,
  PRIORITYNAMES,
  TICKET_TYPE,
  formatDate,
  getVencimiento,
} from "../../utils/utils"; //CREATE
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import UserInfo from "../Users/UserInfo"; //CREATE
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const ICONS = {
  1: <MdKeyboardDoubleArrowUp />,
  2: <MdKeyboardArrowUp />,
  3: <MdKeyboardArrowDown />,
};

const Card = ({ ticket, status }) => {
  const navigate = useNavigate();
  console.log(ticket);

  return (
    <>
      <div className="w-full h-fit bg-white shadow-md p-2 rounded ">
        <div className="w-full flex justify-evenly items-center ">
          <div
            className={clsx(
              "flex flex-1 gap-1 items-center text-sm font-medium",
              PRIOTITYSTYELS[ticket?.prioridad]
            )}
          >
            <span className="text-lg">{ICONS[ticket?.prioridad]}</span>
            <span className="uppercase">
              prioridad {PRIORITYNAMES[ticket?.prioridad]}{" "}
            </span>
          </div>
        </div>
        <>
          <a
            href={`/helpdesk/task/${ticket.id}`}
            className="flex items-center gap-2 hover:text-blue-700 text-decoration-none"
          >
            <div
              className={clsx(
                "w-4 h-4 rounded-full",
                TICKET_TYPE[ticket.estado]
              )}
            />
            <span className="font-semibold text-xl line-clamp-1 text-black">
              {ticket?.tema}
            </span>
          </a>
          <span className="text-sm text-black-600">
            {formatDate(new Date(ticket?.fechaCreacion))}
            <br></br>
          </span>
          <span className="text-sm text-red-600">
            {formatDate(new Date(ticket?.fechaVencimiento))}
          </span>
          <span className="text-sm text-red-600">
            , {getVencimiento(new Date(ticket?.fechaVencimiento))}
          </span>
        </>

        <div className="w-full border-t border-gray-200 my-2" />
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex gap-1 items-center text-sm text-gray-600">
              <BiMessageAltDetail />
              <span>
                Area:{" "}
                <span className="text-decoration-underline">
                  {ticket?.departamentoNombre}
                </span>
              </span>
            </div>
            <div className="flex gap-1 items-center text-sm text-gray-600 ">
              <MdAttachFile />
              <span>{ticket?.codigo}</span>
            </div>
          </div>

          <div className="flex flex-row-reverse">
            <div
              key={ticket?.id}
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                BGS[ticket?.id % BGS?.length]
              )}
            >
              <UserInfo name={ticket?.usuarioAsignadoNombres} />
            </div>
          </div>
        </div>
        <div className="py-4 border-t border-gray-200">
          <div className="text-base line-clamp-1 text-black">
            <div className="textLimited">{ticket?.descripcion}</div>
          </div>
        </div>

        <div className="w-full pb-2">
          <button
            onClick={() => navigate(`/helpdesk/task/${ticket.id}`)}
            className="w-full flex gap-4 items-center text-sm text-gray-500 font-semibold disabled:cursor-not-allowed disabled::text-gray-300"
          >
            <IoMdAdd className="text-lg" />
            <span>REVISAR</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Card;
