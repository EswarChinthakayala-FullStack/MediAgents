import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const useEventBus = () => {
    const [messages, setMessages] = useState([]);
    const [lastMessage, setLastMessage] = useState(null);

    useEffect(() => {
        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            console.log('Connected to Event Bus (via WebSocket)');
        });

        socket.on('event_bus_message', (payload) => {
            console.log('Received Event Bus Message:', payload);
            setLastMessage(payload);
            setMessages((prev) => [payload, ...prev].slice(0, 50));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return { messages, lastMessage };
};
