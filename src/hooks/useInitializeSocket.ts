// src/hooks/useInitializeSocket.ts
import { useEffect } from 'react';
import { initializeSocket } from '../services/socket';

const useInitializeSocket = (token: String | null) => {
  useEffect(() => {
    if (token) {
        initializeSocket(token);
    }
  }, [token]);
};

export default useInitializeSocket;
