import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography, CircularProgress, Box, Grow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Radar } from 'react-chartjs-2';
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import backgroundImage from '../components/assets/courselist-background.jpg';

Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const Grades = () => {
    const [courses, setCourses] = useState([]);
    const [averages, setAverages] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCourseAverage = useCallback(async (courseId) => {
        try {
            const userId = sessionStorage.getItem('userId');
            const response = await axios.get(`http://localhost:8080/api/submissions/student/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            const courseSubmissions = response.data.filter(sub => sub.assignment.course.id === courseId);
            if (courseSubmissions.length === 0) return 'Non noté';
            const total = courseSubmissions.reduce((sum, sub) => sum + (sub.grade || 0), 0);
            const average = (total / courseSubmissions.length).toFixed(2);
            return average;
        } catch (error) {
            console.error("Erreur lors de la récupération de la moyenne du cours :", error);
            return 'Non noté';
        }
    }, []);

    const fetchEnrolledCourses = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/courses/enrolled', {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            setCourses(response.data);

            const averagesPromises = response.data.map(course => fetchCourseAverage(course.id));
            const averagesResults = await Promise.all(averagesPromises);
            const averagesMap = averagesResults.reduce((acc, avg, index) => {
                acc[response.data[index].id] = avg;
                return acc;
            }, {});
            setAverages(averagesMap);

        } catch (error) {
            console.error("Il y a eu une erreur lors de la récupération des cours inscrits :", error);
        } finally {
            setLoading(false);
        }
    }, [fetchCourseAverage]);

    useEffect(() => {
        fetchEnrolledCourses();
    }, [fetchEnrolledCourses]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    const radarData = {
        labels: courses.map(course => course.courseName),
        datasets: [
            {
                label: 'Moyenne des Notes',
                backgroundColor: 'rgba(179, 181, 198, 0.2)',
                borderColor: 'rgba(179, 181, 198, 1)',
                pointBackgroundColor: 'rgba(179, 181, 198, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(179, 181, 198, 1)',
                data: courses.map(course => parseFloat(averages[course.id]) || 0)
            }
        ]
    };

    const radarOptions = {
        scales: {
            r: {
                angleLines: {
                    display: true
                },
                suggestedMin: 0,
                suggestedMax: 20,
                ticks: {
                    stepSize: 5,
                    backdropColor: 'rgba(255, 255, 255, 0.8)',
                },
                grid: {
                    color: '#ccc',
                },
                pointLabels: {
                    font: {
                        size: 12
                    }
                }
            }
        },
        plugins: {
            filler: {
                propagate: false
            }
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
            <Grow in={!loading}>
                <Container sx={{ mt: 4, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 2, p: 3 }}>
                    <Grid container spacing={3}>
                        {courses.map(course => (
                            <Grid item xs={12} sm={6} md={4} key={course.id}>
                                <Card
                                    onClick={() => navigate(`/grades/${course.id}`)}
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 6px 10px rgba(0,0,0,0.2)',
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6" component="div" sx={{ color: '#4caf50' }}>
                                            {course.courseName}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Moyenne : {averages[course.id] !== undefined ? averages[course.id] : 'Non noté'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ mt: 4 }}>
                        <Radar data={radarData} options={radarOptions} />
                    </Box>
                </Container>
            </Grow>
        </Box>
    );
};

export default Grades;
