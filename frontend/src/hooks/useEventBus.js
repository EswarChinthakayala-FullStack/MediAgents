import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const useEventBus = () => {
    const [messages, setMessages] = useState([]);
    const [lastMessage, setLastMessage] = useState(null);

    useEffect(() => {
        const socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            timeout: 10000
        });

        socket.on('connect', () => {
            console.log('✅ Connected to Event Bus (via SocketIO)');
        });

        socket.on('connect_error', (err) => {
            console.error('❌ Connection Error:', err.message);
        });

        socket.on('event_bus_message', (payload) => {
            console.log('📬 Received Event Bus Message:', payload);
            setLastMessage(payload);
            setMessages((prev) => [payload, ...prev].slice(0, 50));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return { messages, lastMessage };
};
