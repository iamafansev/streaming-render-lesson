import { useState } from 'react';
import viteLogo from '/vite.svg';

export const Home = () => {
  const [count, setCount] = useState(0);

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Home</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  )
};