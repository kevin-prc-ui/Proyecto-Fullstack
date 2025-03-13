import React from "react";
import PropTypes from 'prop-types'; // Import PropTypes
import Card from "./Card";

const BoardView = ({ tickets }) => {
  return (
    <div className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10'>
      {tickets.map((ticket, index) => ( // Changed 'tickets' to 'ticket' here
        <Card ticket={ticket} key={index} />
      ))}
    </div>
  );
};

// Add prop type validation
BoardView.propTypes = {
  tickets: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      stage: PropTypes.string.isRequired,
      assets: PropTypes.arrayOf(PropTypes.string).isRequired,
      team: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
      })).isRequired,
      isTrashed: PropTypes.bool.isRequired,
      activities: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
        activity: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        by: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
          })
        ]).isRequired,
        _id: PropTypes.string.isRequired,
      })).isRequired,
      subTickets: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        tag: PropTypes.string.isRequired,
        _id: PropTypes.string.isRequired,
      })).isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
      __v: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default BoardView;
