import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Typography, Button, Grid, Box, CircularProgress, Grow,  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import backgroundImage from '../components/assets/courselist-background.jpg';

const AvailableCourses = () => {
    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();
    

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/courses/available', {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            setCourses(response.data);
        } catch (error) {
            console.error("Il y a eu une erreur lors de la récupération des cours disponibles :", error);
        }
    };

    const fetchEnrolledCourses = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/courses/enrolled', {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            setEnrolledCourses(response.data);
        } catch (error) {
            console.error("Il y a eu une erreur lors de la récupération des cours inscrits :", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchCourses();
            await fetchEnrolledCourses();
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleEnroll = async (courseId) => {
        try {
            await axios.post(`http://localhost:8080/api/courses/${courseId}/enroll`, {}, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            setLoading(true);
            await fetchCourses();
            await fetchEnrolledCourses();
            setLoading(false);
        } catch (error) {
            console.error("Il y a eu une erreur lors de l'inscription au cours :", error);
        }
    };

    const handleOpenDialog = (courseId) => {
        setSelectedCourseId(courseId);
        setOpenDialog(true);
    };
    
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    
    const confirmEnroll = async () => {
        if (selectedCourseId) {
            await handleEnroll(selectedCourseId);
            setSelectedCourseId(null);
            handleCloseDialog();
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
                    <Container sx={{ mt: 4, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 2, p: 3 }}>
                          <IconButton onClick={() => navigate(-1)}>
                          <ArrowBackIcon />
                          </IconButton>
                        <Typography variant="h4" gutterBottom>Mes Cours Inscrits</Typography>
                        <Grid container spacing={4}>
                            {enrolledCourses.length > 0 ? (
                                enrolledCourses.map(course => (
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
                                    <Typography variant="body1">Vous n'êtes inscrits à aucun cours pour le moment</Typography>
                                </Grid>
                            )}
                        </Grid>

                        <Dialog open={openDialog} onClose={handleCloseDialog}>
                           <DialogTitle>Confirmer l'inscription</DialogTitle>
                           <DialogContent>
                            <DialogContentText>
                             Êtes-vous sûr de vouloir vous inscrire à ce cours ?
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                           <Button onClick={handleCloseDialog} color="secondary">
                            Annuler
                           </Button>
                           <Button onClick={confirmEnroll} color="primary">
                            Confirmer
                           </Button>
                          </DialogActions>
                        </Dialog>

                        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>Cours Disponibles</Typography>
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
                                                <Typography variant="h6" gutterBottom sx={{ color: '#4caf50' }}>
                                                    {course.courseName}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Enseignant: {course.teacherGenre ? (course.teacherGenre === 'HOMME' ? 'Monsieur' : 'Madame') : 'Information manquante'} {course.teacherName || 'Information manquante'}
                                                </Typography>
                                                <Button variant="contained" color="primary" fullWidth onClick={() => handleOpenDialog(course.id)}>
                                                    S'inscrire
                                                </Button>
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
                    </Container>
                </Grow>
            )}
        </Box>
    );
};

export default AvailableCourses;
