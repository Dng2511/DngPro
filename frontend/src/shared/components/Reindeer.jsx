import React from 'react';
import './Reindeer.css';
import reindeerImg from '../../assets/santa.png';

const Reindeer = () => {
  return (
    <div className="reindeer-wrapper">
      <img src={reindeerImg} alt="Reindeer" className="reindeer-running" />
    </div>
  );
};

export default Reindeer;