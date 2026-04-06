import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="whitespace-nowrap p-1 font-bold text-2xl sm:text-4xl lg:text-5xl text-gray-700 tabular-nums">
      {time}
    </div>
  );
};

export default Clock;
