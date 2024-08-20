import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserProviderWithNavigate';
import { TextField, Button, MenuItem, Container, Typography, Box, Paper, CircularProgress, Grow } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from '../components/assets/courselist-background.jpg';

const CreateNews = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.id) {
            axios.get(`http://localhost:8080/api/courses/teacher/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            })
            .then(response => {
                setCourses(response.data);
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
            })
            .finally(() => setLoading(false));
        }
    }, [user]);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`http://localhost:8080/api/news/${user.id}`, {
            title,
            content,
            courseId: selectedCourse
        }, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
        .then(response => {
            toast.success('Actualité créée avec succès !', {
                onClose: () => navigate('/teacher-news')
            });
        })
        .catch(error => {
            toast.error('Erreur lors de la création de l\'actualité');
            console.error('Error creating news:', error);
        });
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
                            Créer une Actualité
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Titre"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Contenu"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                fullWidth
                                multiline
                                rows={4}
                                margin="normal"
                            />
                            <TextField
                                label="Cours"
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                required
                                select
                                fullWidth
                                margin="normal"
                            >
                                {courses.map(course => (
                                    <MenuItem key={course.id} value={course.id}>
                                        {course.courseName}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                <Button type="submit" variant="contained" color="primary" sx={{ minWidth: '150px' }}>
                                    Créer
                                </Button>
                            </Box>
                        </form>
                        <ToastContainer />
                    </Container>
                </Grow>
            )}
        </Box>
    );
};

export default CreateNews;
