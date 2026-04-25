"use client";

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useNotifications = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [latestOrder, setLatestOrder] = useState<any>(null);

    useEffect(() => {
        const newSocket = io('https://api-production-48c5.up.railway.app', {
            transports: ['websocket'],
            upgrade: false
        });
        newSocket.on('connect', () => {
            console.log('Connected to socket');
            newSocket.emit('join_user', 'admins');
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
