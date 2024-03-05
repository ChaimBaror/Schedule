import React, { useState } from 'react';

const Clock: React.FC = () => {
    const [newTime, setNewTime] = useState('');

    const displayClock = () => {
        const display = new Date().toLocaleTimeString('en-GB');
        setNewTime(display);
    }
    setTimeout(displayClock, 1000);
    
    return (
        <div className='whitespace-nowrap p-1 font-bold text-5xl text-gray-700 '>
            {newTime}
        </div>
    );
}

export default Clock;
