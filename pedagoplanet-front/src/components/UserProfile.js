import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, CircularProgress, Card, CardContent, Avatar, Grid, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    card: {
        maxWidth: 600,
        margin: 'auto',
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        width: theme.spacing(10),
        height: theme.spacing(10),
        marginBottom: theme.spacing(2),
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    },
}));

const UserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const classes = useStyles();
    const navigate = useNavigate();
    const currentUserId = sessionStorage.getItem('userId'); 

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
                setUser(response.data);
                setError(null);
            } catch (error) {
                console.error("There was an error fetching the user details:", error);
                setError(`Erreur: ${error.response?.status || 'Inconnue'} - ${error.message}`);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [userId]);

    const handleSendMessage = () => {
        if (user) {
            navigate(`/message/${currentUserId}/${userId}`);
        }
    };

    if (loading) {
        return (
            <Container className={classes.root}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className={classes.root}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container className={classes.root}>
                <Typography variant="h6">
                    Aucun utilisateur trouvé.
                </Typography>
            </Container>
        );
    }

    return (
        <Container className={classes.root}>
            <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
            </IconButton>
            <Card className={classes.card}>
                <CardContent>
                    <div className={classes.header}>
                        <Avatar alt={`${user.firstName} ${user.lastName}`} className={classes.avatar}>
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </Avatar>
                        <Typography variant="h4" gutterBottom>
                            {user.firstName} {user.lastName}
                        </Typography>
                    </div>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="body1">Email: {user.email}</Typography>
                        </Grid>
                        {currentUserId !== userId && (
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" onClick={handleSendMessage}>
                                    Envoyer un message
                                </Button>
                            </Grid>
                        )}
                        {}
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
};

export default UserProfile;
