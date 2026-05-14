import { useEffect, useRef } from 'react';
import { getSocket } from './socket';

export function useSocketEvent<T>(event: string, callback: (data: T) => void) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const socket = getSocket();
    const handler = (data: T) => savedCallback.current(data);
    
    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [event]);
}