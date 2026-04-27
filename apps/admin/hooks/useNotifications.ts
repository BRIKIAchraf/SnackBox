"use client";

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../lib/api-config';

export const useNotifications = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [latestOrder, setLatestOrder] = useState<any>(null);

    useEffect(() => {
        const newSocket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnectionAttempts: 5,
            timeout: 10000,
        });
        
        newSocket.on('connect', () => {
            console.log('Admin connected to notifications');
            newSocket.emit('join_admin');
        });
        setSocket(newSocket);

        newSocket.on('new_order', (order) => {
            console.log('New order received:', order);
            setLatestOrder(order);
            // Play notification sound
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
            audio.play().catch(e => console.log('Audio blocked', e));
        });

        return () => {
            newSocket.close();
        };
    }, []);

    return { socket, latestOrder, setLatestOrder };
};
