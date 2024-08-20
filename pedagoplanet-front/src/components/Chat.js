import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useParams } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper } from '@mui/material';
import axios from 'axios';
import { UserContext } from '../contexts/UserProviderWithNavigate';

let stompClient = null;

const Chat = () => {
    const { receiverId } = useParams();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [receiver, setReceiver] = useState({});
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext); 
    const userId = user.id;
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const fetchMessages = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/messages/${userId}/${receiverId}`);
            setMessages(response.data);
            console.log('Messages fetched:', response.data); 
            scrollToBottom(); 
        } catch (error) {
            console.error("There was an error fetching the messages:", error);
            setError('Erreur lors de la récupération des messages. Veuillez réessayer plus tard.');
        }
    }, [userId, receiverId]);

    const fetchReceiver = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/users/${receiverId}`);
            setReceiver(response.data);
            console.log('Receiver fetched:', response.data); 
        } catch (error) {
            console.error("There was an error fetching the receiver information:", error);
            setError('Erreur lors de la récupération des informations du destinataire. Veuillez réessayer plus tard.');
        }
    }, [receiverId]);

    const onMessageReceived = useCallback((msg) => {
        const newMessage = JSON.parse(msg.body);
        console.log('Message received:', newMessage); 
        setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, newMessage];
            return updatedMessages;
        });
        scrollToBottom();  
    }, []);

    const onError = useCallback((err) => {
        console.error('Error connecting to WebSocket:', err);
        setError('Could not connect to WebSocket server. Please try again later.');
    }, []);

    const onConnected = useCallback(() => {
        console.log('Connected to WebSocket');
        stompClient.subscribe(`/user/${user.username}/queue/messages`, onMessageReceived);
        fetchMessages(); 
        fetchReceiver(); 
    }, [onMessageReceived, fetchMessages, fetchReceiver, user.username]);

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
        if (!message.trim()) return;
        
        const messageRequest = {
            senderId: parseInt(userId, 10),
            receiverId: parseInt(receiverId, 10),
            message: message,
        };

        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(messageRequest),
            });
           
            const newMessage = {
                senderId: parseInt(userId),
                senderFirstName: user.firstName,
                senderLastName: user.lastName,
                receiverId: parseInt(receiverId),
                message: message,
                sentAt: new Date().toISOString()
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            console.log('Message sent:', newMessage); 
            setMessage('');
            scrollToBottom();  
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
                <Typography variant="h5" sx={{ mt: 4 }}>Fil de discussion avec {receiver.firstName} {receiver.lastName}</Typography>
                <Box mt={4}>
                    <Typography variant="h6">Messages</Typography>
                    <List>
                        {messages.map((msg, index) => (
                            <ListItem 
                                key={index} 
                                alignItems="flex-start" 
                                sx={{ 
                                    justifyContent: msg.senderId === parseInt(userId, 10) ? 'flex-end' : 'flex-start' 
                                }}
                            >
                                {msg.senderId !== parseInt(userId, 10) && (
                                    <ListItemAvatar>
                                        <Avatar alt={msg.senderFirstName} src="/static/images/avatar/1.jpg" />
                                    </ListItemAvatar>
                                )}
                                <Paper 
                                    elevation={3} 
                                    sx={{ 
                                        p: 2, 
                                        maxWidth: '75%', 
                                        backgroundColor: msg.senderId === parseInt(userId, 10) ? '#e1ffc7' : '#ffffff' 
                                    }}
                                >
                                    <ListItemText
                                        primaryTypographyProps={{ variant: 'body1' }}
                                        secondaryTypographyProps={{ variant: 'body1' }}
                                        primary={msg.message}
                                        secondary={`De: ${msg.senderFirstName} ${msg.senderLastName}`}
                                    />
                                </Paper>
                                {msg.senderId === parseInt(userId, 10) && (
                                    <ListItemAvatar>
                                        <Avatar alt={msg.senderFirstName} src="/static/images/avatar/1.jpg" />
                                    </ListItemAvatar>
                                )}
                            </ListItem>
                        ))}
                        <div ref={messagesEndRef} />
                    </List>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <TextField
                    label="Message"
                    variant="outlined"
                    multiline
                    maxRows={4} 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    fullWidth
                    InputProps={{ style: { fontSize: '1rem' } }} 
                />
                {error && (
                    <Typography variant="body2" color="error">
                        {error}
                    </Typography>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendMessage}
                    sx={{ ml: 2, height: 'fit-content', fontSize: '1rem' }} 
                    disabled={!message.trim()} 
                >
                    Envoyer
                </Button>
            </Box>
        </Container>
    );
};

export default Chat;
