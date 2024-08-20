import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

const UserProviderWithNavigate = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = sessionStorage.getItem('token');
            if (token && !user) {
                const response = await axios.get('http://localhost:8080/api/auth/user', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUser(response.data);
                sessionStorage.setItem('user', JSON.stringify(response.data));
            }
        };

        fetchUser();
    }, [user]);

    useEffect(() => {
        if (user) {
            const fetchNotifications = async () => {
                const response = await axios.get('http://localhost:8080/api/notifications', {
                    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 'userId': user.id }
                });
                setNotifications(response.data);
            };

            fetchNotifications();
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            sessionStorage.setItem('user', JSON.stringify(user));
        } else {
            sessionStorage.removeItem('user');
        }
    }, [user]);

    const logout = useCallback(() => {
        setUser(null);
        setNotifications([]);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/');
    }, [navigate]);

    return (
        <UserContext.Provider value={{ user, setUser, notifications, setNotifications, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProviderWithNavigate;
