import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress, Grow } from '@mui/material';
import backgroundImage from '../components/assets/grade-background.png';

const StudentGrades = () => {
    const { courseId } = useParams();
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/courses/${courseId}/grades`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                console.log("Grades response:", response.data);  
                setGrades(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des notes des étudiants :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGrades();
    }, [courseId]);

    const groupedGrades = grades.reduce((acc, grade) => {
        if (!acc[grade.studentId]) {
            acc[grade.studentId] = {
                studentName: grade.studentName,
                grades: []
            };
        }
        acc[grade.studentId].grades.push(grade.grade);
        return acc;
    }, {});

    const maxAssignments = Math.max(...Object.values(groupedGrades).map(student => student.grades.length));

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
                    <Box sx={{ padding: '20px', width: '100%', maxWidth: '1200px' }}>
                        <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 2, p: 3 }}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontSize: { xs: '12px', md: '18px' }, fontWeight: 'bold' }}>Nom de l'étudiant</TableCell>
                                        {Array.from({ length: maxAssignments }, (_, i) => (
                                            <TableCell key={i} sx={{ fontSize: { xs: '10px', md: '18px' }, fontWeight: 'bold' }}>
                                                Devoir {i + 1}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(groupedGrades).map(([studentId, studentData]) => (
                                        <TableRow key={studentId} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                                            <TableCell sx={{ fontSize: { xs: '10px', md: '16px' } }}>{studentData.studentName}</TableCell>
                                            {Array.from({ length: maxAssignments }, (_, i) => (
                                                <TableCell key={i} sx={{ fontSize: { xs: '8px', md: '16px' } }}>
                                                    {studentData.grades[i] !== undefined ? studentData.grades[i] : 'Non noté'}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Grow>
            )}
        </Box>
    );
};

export default StudentGrades;
