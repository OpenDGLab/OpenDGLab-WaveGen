import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
window.wavegen = {
  a0: 0,
  a1: 0,
  a2: 0,
  b0: 30,
  b1: 30,
  b2: 30,
  c0: 2,
  c1: 2,
  c2: 2,
  j0: 8,
  j1: 8,
  j2: 8,
  pc0: 1,
  pc1: 1,
  pc2: 1,
  jie1: 0,
  jie2: 0,
  l: 5,
  zy: 10,
  point1: {0: 20, 1: 20},
  point2: {0: 20, 1: 20},
  point3: {0: 20, 1: 20}
};
ReactDOM.render(
  <React.StrictMode>
    <div unresolved="unresolved" className="main-container main-padding">
        <App />
    </div>
    <div className="status-icon" unresolved="unresolved">
      <img alt="OpenDGLab WaveGen" src="OpenDGLab-WaveGen.svg" className="size-50vh"></img>
      <p className="main-color subtitle-font">OpenDGLab 波形生成</p>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

setTimeout(() => {
  document.querySelectorAll('[unresolved]').forEach((v) => {
    v.removeAttribute('unresolved')
  })
}, 2000);
