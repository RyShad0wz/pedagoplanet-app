import React, { useEffect, useState, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useParams } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper } from '@mui/material';

let stompClient = null;

const SendMessage = () => {
    const { userId, receiverId } = useParams(); 
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);

    const onMessageReceived = useCallback((msg) => {
        const newMessage = JSON.parse(msg.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    }, []);

    const onError = useCallback((err) => {
        console.error('Error connecting to WebSocket:', err);
        setError('Could not connect to WebSocket server. Please try again later.');
    }, []);

    const onConnected = useCallback(() => {
        console.log('Connected to WebSocket');
        stompClient.subscribe('/user/queue/messages', onMessageReceived);
    }, [onMessageReceived]);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`, 
            },
            onConnect: onConnected,
            onStompError: onError,
        });
        stompClient.activate();

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, [onConnected, onError]);

    const handleSendMessage = () => {
        const messageRequest = {
            senderId: userId,
            receiverId: receiverId,
            content: message,
        };

        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(messageRequest),
            });
            setMessage('');
        }
    };

    return (
        <Container>
            <Box mt={4}>
                <Typography variant="h5">Envoyer un message</Typography>
                <TextField
                    label="Message"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                />
                {error && (
                    <Typography variant="body2" color="error">
                        {error}
                    </Typography>
                )}
                <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ mt: 2 }}>
                    Envoyer
                </Button>
                <Box mt={4}>
                    <Typography variant="h6">Messages</Typography>
                    <List>
                        {messages.map((msg, index) => (
                            <ListItem key={index} alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt={msg.senderFirstName} src="/static/images/avatar/1.jpg" />
                                </ListItemAvatar>
                                <Paper elevation={3} sx={{ p: 2, maxWidth: '75%', backgroundColor: msg.senderId === userId ? '#e1ffc7' : '#ffffff' }}>
                                    <ListItemText
                                        primary={msg.content}
                                        secondary={`De: ${msg.senderFirstName} ${msg.senderLastName}`}
                                    />
                                </Paper>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>
        </Container>
    );
};

export default SendMessage;
