import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Typography, Button, Box, Paper, CircularProgress, Grow } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from '../components/assets/courselist-background.jpg';

const CreateCourse = () => {
    const [courseName, setCourseName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAddCourse = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/courses', 
                { courseName, description }, 
                {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            toast.success('Cours créé avec succès !', {
                onClose: () => navigate('/teacher-dashboard/courses')
            });
        } catch (error) {
            console.error("There was an error adding the course:", error);
            toast.error("Erreur lors de la création du cours");
        } finally {
            setLoading(false);
        }
    };

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
                padding: '20px'
            }}
        >
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grow in={!loading}>
                    <Container component={Paper} sx={{ padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 2 }}>
                        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
                            Création nouvel espace de cours
                        </Typography>
                        <Box component="form" onSubmit={handleAddCourse} sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                label="Nom du cours"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                                variant="outlined"
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Description du cours"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                variant="outlined"
                                margin="normal"
                                required
                            />
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Button variant="contained" color="primary" type="submit">
                                    Ajouter le cours
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                </Grow>
            )}
            <ToastContainer />
        </Box>
    );
};

export default CreateCourse;
