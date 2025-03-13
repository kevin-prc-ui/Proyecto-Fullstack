import React from "react";
import Card from "./Card";

const BoardView = ({ tickets }) => {
  return (
    <div  className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 2xl:gap-10'>
      {tickets.map((ticket, index) => ( // Changed 'tickets' to 'ticket' here
        <Card ticket={ticket} key={index} />
      ))}
    </div>
  );
};

// Add prop type validation


export default BoardView;
