import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserProviderWithNavigate';
import { Container, Box, Typography, CircularProgress, Grid, Paper } from '@mui/material';
import { School as SchoolIcon, Announcement as AnnouncementIcon, AddCircle as AddCircleIcon } from '@mui/icons-material';
import backgroundImage from '../components/assets/courselist-background.jpg';
import logo from './assets/logo.png';

const TeacherDashboard = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'TEACHER') {
            navigate('/');
        } else {
            setTimeout(() => setLoading(false), 1000);
        }
    }, [user, navigate]);

    if (loading) {
        return (
            <Box 
                sx={{ 
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box 
            sx={{ 
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                fontFamily: 'Roboto, sans-serif'
            }}
        >
            <Container maxWidth="md" sx={{ mt: 5, transition: 'opacity 1s ease-in-out', opacity: loading ? 0 : 1 }}>
                <Box sx={{ p: 3, bgcolor: 'rgba(255, 255, 255, 0.9)', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}>
                        Espace Enseignant
                    </Typography>
                    <img src={logo} alt="PedaGoPlanet Logo" style={{ width: '100px', margin: '20px 0' }} />
                    <Typography variant="body1" gutterBottom sx={{ fontSize: '18px', fontFamily: 'Roboto, sans-serif' }}>
                        Bonjour {user.firstName}
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ fontSize: '18px', fontFamily: 'Roboto, sans-serif' }}>
                        Bienvenue dans votre espace, gérez vos cours et partagez des nouvelles avec vos étudiants.
                    </Typography>
                    <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                        <Grid item xs={12} sm={4}>
                            <Paper 
                                elevation={3} 
                                sx={{
                                    textAlign: 'center', 
                                    padding: 2, 
                                    cursor: 'pointer', 
                                    transition: 'transform 0.3s, box-shadow 0.3s', 
                                    '&:hover': {
                                        transform: 'scale(1.05)', 
                                        boxShadow: '0 6px 10px rgba(0,0,0,0.2)',
                                    },
                                    '&:hover svg': {
                                        transform: 'scale(1.2)',
                                    }
                                }}
                                onClick={() => navigate('/teacher-dashboard/courses')}
                            >
                                <SchoolIcon sx={{ fontSize: 40, color: '#4caf50', transition: 'transform 0.3s' }} />
                                <Typography variant="h6" sx={{ mt: 1 }}>Voir les Cours</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Paper 
                                elevation={3} 
                                sx={{
                                    textAlign: 'center', 
                                    padding: 2, 
                                    cursor: 'pointer', 
                                    transition: 'transform 0.3s, box-shadow 0.3s', 
                                    '&:hover': {
                                        transform: 'scale(1.05)', 
                                        boxShadow: '0 6px 10px rgba(0,0,0,0.2)',
                                    },
                                    '&:hover svg': {
                                        transform: 'scale(1.2)',
                                    }
                                }}
                                onClick={() => navigate('/teacher-news')}
                            >
                                <AnnouncementIcon sx={{ fontSize: 40, color: '#4caf50', transition: 'transform 0.3s' }} />
                                <Typography variant="h6" sx={{ mt: 1 }}>Voir les Actualités</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Paper 
                                elevation={3} 
                                sx={{
                                    textAlign: 'center', 
                                    padding: 2, 
                                    cursor: 'pointer', 
                                    transition: 'transform 0.3s, box-shadow 0.3s', 
                                    '&:hover': {
                                        transform: 'scale(1.05)', 
                                        boxShadow: '0 6px 10px rgba(0,0,0,0.2)',
                                    },
                                    '&:hover svg': {
                                        transform: 'scale(1.2)',
                                    }
                                }}
                                onClick={() => navigate('/create-course')}
                            >
                                <AddCircleIcon sx={{ fontSize: 40, color: '#4caf50', transition: 'transform 0.3s' }} />
                                <Typography variant="h6" sx={{ mt: 1 }}>Créer un Nouveau Cours</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default TeacherDashboard;