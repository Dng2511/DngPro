import React, { useEffect, useState } from 'react';
import './SnowFall.css';
import snowflakeImg from '../../assets/snowflake.png';

const SnowFall = () => {
  const [flakes, setFlakes] = useState([]);

  useEffect(() => {
    // Tạo danh sách các bông tuyết với thuộc tính ngẫu nhiên
    const createFlakes = () => {
      const flakeCount = 50; 
      const newFlakes = Array.from({ length: flakeCount }).map((_, index) => ({
        id: index,
        left: Math.random() * 100, 
        animationDuration: Math.random() * 5 + 5, 
        animationDelay: Math.random() * 5, 
        size: Math.random() * 15 + 15, 
        opacity: Math.random() * 0.5 + 0.5,
      }));
      setFlakes(newFlakes);
    };

    createFlakes();
  }, []);

  return (
    <div className="snow-container">
      {flakes.map((flake) => (
        <img
          key={flake.id}
          src={snowflakeImg}
          alt="snowflake"
          className="snowflake"
          style={{
            left: `${flake.left}vw`,
            width: `${flake.size}px`,
            opacity: flake.opacity,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${flake.animationDelay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default SnowFall;