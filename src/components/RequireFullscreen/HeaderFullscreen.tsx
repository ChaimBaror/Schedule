import React, { useEffect, useRef } from 'react';
import { RequireFullscreen } from './RequireFullscreen';
import Fullscreen from '../Home-component';

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
            <span className="button button--primary button--round button--lg ">fullscreen</span>
          </button>
        </div>
      )}
    </RequireFullscreen>
  );
};

