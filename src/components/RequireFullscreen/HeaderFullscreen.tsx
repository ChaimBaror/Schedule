import React, { useEffect, useRef } from 'react';
import { RequireFullscreen } from './RequireFullscreen';

export const HeaderFullscreen: React.FC = () => {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    rootRef.current = document.getElementById('Fullscreen-Background');
  }, []);

  return (
    <RequireFullscreen component={rootRef} >
      {(isFullscreen) => (
        <div>
          <button >
            <span className="bg-gray-500 text-white font-medium py-1 px-2 rounded">full-screen</span>
          </button>
        </div>
      )}
    </RequireFullscreen>
  );
};

