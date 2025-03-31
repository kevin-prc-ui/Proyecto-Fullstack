import clsx from "clsx";
import React, { useState } from "react";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { BGS, PRIOTITYSTYELS, TICKET_TYPE, formatDate } from "../../utils/utils";//CREATE
import TicketDialog from "./Dialog";//CREATE
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import UserInfo from "../Users/UserInfo";//CREATE
import { IoMdAdd } from "react-icons/io";
import AddSubTicket from "./AddSubTicket";//CREATE

const ICONS = {
  1: <MdKeyboardDoubleArrowUp />,
  2: <MdKeyboardArrowUp />,
  3: <MdKeyboardArrowDown />,
};

const Card = ({ ticket, status}) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
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
            <span className="uppercase">prioridad {ticket?.prioridad} </span>
          </div>

          {user?.isAdmin && <TicketDialog ticket={ticket} />}
        </div>

        <>
          <div className="flex items-center gap-2">
            <div
              className={clsx("w-4 h-4 rounded-full", TICKET_TYPE[ticket.estado])}
            />
            <h4 className="line-clamp-1 text-black">{ticket?.tema}</h4>
          </div>
          <span className="text-sm text-gray-600">
            {formatDate(new Date(ticket?.fechaVencimiento))}
          </span>
        </>

        <div className="w-full border-t border-gray-200 my-2" />
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex gap-1 items-center text-sm text-gray-600">
              <BiMessageAltDetail />
              <span>{ticket?.activities?.length}</span>
            </div>
            <div className="flex gap-1 items-center text-sm text-gray-600 ">
              <MdAttachFile />
              <span>{ticket?.assets?.length}</span>
            </div>
            <div className="flex gap-1 items-center text-sm text-gray-600 ">
              <FaList />
              <span>0/{ticket?.subTickets?.length}</span>
            </div>
          </div>

          <div className="flex flex-row-reverse">
            {ticket?.team?.map((m, index) => (
              <div
                key={index}
                className={clsx(
                  "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                  BGS[index % BGS?.length]
                )}
              >
                <UserInfo user={m} />
              </div>
            ))}
          </div>
        </div>

        {/* sub tickets */}
        {ticket?.subTickets?.length > 0 ? (
          <div className="py-4 border-t border-gray-200">
            <h5 className="text-base line-clamp-1 text-black">
              {ticket?.subTickets[0].tema}
            </h5>

            <div className="p-4 space-x-8">
              <span className="text-sm text-gray-600">
                {formatDate(new Date(ticket?.subTickets[0]?.fechaVencimiento))}
              </span>
              <span className="bg-blue-600/10 px-3 py-1 rounded0full text-blue-700 font-medium">
                {ticket?.subTickets[0].tag}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="py-4 border-t border-gray-200">
              <span className="text-gray-500">No Sub Ticket</span>
            </div>
          </>
        )}

        <div className="w-full pb-2">
          <button
            onClick={() => setOpen(true)}
            className="w-full flex gap-4 items-center text-sm text-gray-500 font-semibold disabled:cursor-not-allowed disabled::text-gray-300">
            <IoMdAdd className="text-lg" />
            <span>ADD SUBTICKET</span>
          </button>
        </div>
      </div>

      <AddSubTicket open={open} setOpen={setOpen} id={ticket.id} />
    </>
  );
};

export default Card;
