// src/components/Loading.js
import React from 'react';
import './loading.css';

const Loading = () => {
  return (
    <div className="loading ps-5 pe-5 text-center" style={{ height: '85vh' }}>
      <div className="dot dot1"></div>
      <div className="dot dot2"></div>
      <div className="dot dot3"></div>
    </div>
  );
};

export default Loading;
