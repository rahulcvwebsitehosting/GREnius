import React, { useEffect } from 'react';
export default function Test() {
  useEffect(() => {
    try {
      const blob = new Blob([`importScripts('https://unpkg.com/stockfish@18.0.7/bin/stockfish.js');`], {type: 'application/javascript'});
      const worker = new Worker(URL.createObjectURL(blob) + '#https://unpkg.com/stockfish@18.0.7/bin/stockfish.wasm');
      worker.onmessage = (e) => console.log('Worker said:', e.data);
      worker.postMessage('uci');
    } catch (e) {
      console.error(e);
    }
  }, []);
  return <div>Test</div>;
}
