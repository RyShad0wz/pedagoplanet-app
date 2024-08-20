import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { UserContext } from '../contexts/UserProviderWithNavigate';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin);

const CourseGrades = () => {
    const { courseId } = useParams();
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const assignmentsResponse = await axios.get(`http://localhost:8080/api/assignments/course/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                setAssignments(assignmentsResponse.data);

                const submissionsResponse = await axios.get(`http://localhost:8080/api/submissions/student/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                setSubmissions(submissionsResponse.data);

            } catch (error) {
                console.error("Erreur lors de la récupération des données du cours :", error);
            }
        };

        fetchCourseData();
    }, [courseId, user.id]);

    const calculateAverage = () => {
        const courseSubmissions = submissions.filter(sub => 
            assignments.some(assign => assign.id === sub.assignment.id)
        );
        if (courseSubmissions.length === 0) return 'Non noté';
        const total = courseSubmissions.reduce((sum, sub) => sum + (sub.grade || 0), 0);
        return (total / courseSubmissions.length).toFixed(2);
    };

    const gradesData = {
        labels: assignments.map(assignment => assignment.title),
        datasets: [
            {
                label: 'Notes',
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: assignments.map(assignment => {
                    const submission = submissions.find(sub => sub.assignment.id === assignment.id);
                    return submission ? submission.grade : 0;
                })
            }
        ]
    };

    const chartOptions = {
        scales: {
            y: {
                min: 0,
                max: 20,
                ticks: {
                    stepSize: 5,
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Notes par Devoir',
                fontSize: 20
            },
            legend: {
                display: true,
                position: 'right'
            },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: 10,
                        yMax: 10,
                        borderColor: 'red',
                        borderWidth: 2,
                        label: {
                            content: 'Moyenne',
                            enabled: true,
                            position: 'end'
                        }
                    }
                }
            }
        }
    };

    return (
        <Box sx={{ padding: '20px' }}>
            <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
                Notes du cours
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>Nom du Devoir</TableCell>
                            <TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>Note</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assignments.map((assignment) => {
                            const submission = submissions.find(sub => sub.assignment.id === assignment.id);
                            return (
                                <TableRow key={assignment.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                                    <TableCell sx={{ fontSize: '16px' }}>{assignment.title}</TableCell>
                                    <TableCell sx={{ fontSize: '16px' }}>{submission ? submission.grade : 'Non noté'}</TableCell>
                                </TableRow>
                            );
                        })}
                        <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                            <TableCell sx={{ fontSize: '16px', fontWeight: 'bold' }}>Moyenne</TableCell>
                            <TableCell sx={{ fontSize: '16px', fontWeight: 'bold' }}>{calculateAverage()}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ mt: 4 }}>
                <Bar
                    data={gradesData}
                    options={chartOptions}
                />
            </Box>
        </Box>
    );
};

export default CourseGrades;
