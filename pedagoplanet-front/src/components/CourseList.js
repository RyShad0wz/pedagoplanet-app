import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Typography, Button, Grid, Box, CircularProgress, Grow, IconButton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import backgroundImage from '../components/assets/courselist-background.jpg'; 

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/courses', {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                setCourses(response.data);
            } catch (error) {
                console.error("There was an error fetching the courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleCreateCourse = () => {
        navigate('/create-course');
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
                    <Container sx={{ mt: 4, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 2, p: 3 }}>
                          <IconButton onClick={() => navigate(-1)}>
                          <ArrowBackIcon />
                          </IconButton>
                        <Typography variant="h4" gutterBottom>Liste des Cours</Typography>
                        <Grid container spacing={4}>
                            {courses.length > 0 ? (
                                courses.map(course => (
                                    <Grid item xs={12} sm={6} md={4} key={course.id}>
                                        <Card
                                            sx={{
                                                transition: 'transform 0.3s, box-shadow 0.3s',
                                                '&:hover': {
                                                    transform: 'scale(1.05)',
                                                    boxShadow: '0 6px 10px rgba(0,0,0,0.2)',
                                                },
                                            }}
                                        >
                                            <CardContent>
                                                <Link to={`/courses/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    <Typography variant="h6" gutterBottom sx={{ color: '#4caf50' }}>
                                                        {course.courseName}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Enseignant: {course.teacherGenre ? (course.teacherGenre === 'HOMME' ? 'Monsieur' : 'Madame') : 'Information manquante'} {course.teacherName || 'Information manquante'}
                                                    </Typography>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Grid item xs={12}>
                                    <Typography variant="body1">Aucun cours disponible</Typography>
                                </Grid>
                            )}
                        </Grid>
                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={handleCreateCourse}
                            >
                                Ajouter un nouveau cours
                            </Button>
                        </Box>
                    </Container>
                </Grow>
            )}
        </Box>
    );
};

export default CourseList;
