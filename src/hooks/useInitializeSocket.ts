// src/hooks/useInitializeSocket.ts
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { initializeSocket } from '../services/socket';

const useInitializeSocket = (token: string | null) => {
  useEffect(() => {
    if (token) {
        initializeSocket();
    }
  }, [token]);
};

export default useInitializeSocket;
