import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Container, Box, Typography, Button, Card, CardContent, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, LinearProgress, Tooltip, Grid, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AWS from 'aws-sdk';
import { UserContext } from '../contexts/UserProviderWithNavigate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AssignmentDetails = () => {
    const { assignmentId } = useParams();
    const [assignment, setAssignment] = useState(null);
    
    const [submissions, setSubmissions] = useState([]);
    const [submission, setSubmission] = useState(null);

    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);

    const [newSubmissionFile, setNewSubmissionFile] = useState(null);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [grade, setGrade] = useState('');
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchAssignmentDetails = async () => {
            try {
                const assignmentResponse = await axios.get(`http://localhost:8080/api/assignments/${assignmentId}`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                setAssignment(assignmentResponse.data);

                const submissionsResponse = await axios.get(`http://localhost:8080/api/submissions/assignment/${assignmentId}`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                setSubmissions(submissionsResponse.data);

                if (user.role === 'STUDENT') {
                    setSubmission(submissionsResponse.data.find(sub => sub.student.id === user.id) || null);
                }
            } catch (error) {
                console.error("Il y a eu une erreur lors de la récupération des détails du devoir :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignmentDetails();
    }, [assignmentId, user.id, user.role]);

    const handleNewSubmissionFileChange = (event) => {
        setNewSubmissionFile(event.target.files[0]);
    };

    const handleSubmitAssignment = async () => {
        if (!newSubmissionFile) {
            alert('Veuillez sélectionner un fichier à soumettre');
            return;
        }

        AWS.config.update({
            accessKeyId: 'AKIAQEIP3NBUO6NGDFRI',
            secretAccessKey: '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',
            region: 'eu-north-1' 
        });

        const s3 = new AWS.S3();
        const params = {
            Bucket: 'pedagoplanetuploadfile',
            Key: newSubmissionFile.name,
            Body: newSubmissionFile
        };

        try {
            console.log('Téléchargement du fichier', params);
            const uploadResult = await s3.upload(params).promise();
            const fileUrl = uploadResult.Location;
            console.log('Fichier téléchargé', fileUrl);

            const submissionPayload = {
                fileUrl: fileUrl,
                grade: null,
                student: { id: user.id },
                assignment: { id: assignmentId }
            };

            await axios.post(`http://localhost:8080/api/submissions`, submissionPayload, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });

            const submissionResponse = await axios.get(`http://localhost:8080/api/submissions/assignment/${assignmentId}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            setSubmission(submissionResponse.data.find(sub => sub.student.id === user.id) || null);

            setNewSubmissionFile(null);
            setIsSubmitModalOpen(false);
            toast.success("Devoir bien envoyé");
        } catch (error) {
            console.error('Erreur lors de l\'envoi du devoir:', error);
            if (error.response) {
                console.error('Erreur de réponse:', error.response.data);
            } else if (error.request) {
                console.error('Erreur de requête:', error.request);
            } else {
                console.error('Erreur générale:', error.message);
            }
            toast.error("Erreur lors de l'envoi du devoir. Vérifiez les journaux pour plus de détails.");
        }
    };

    const handleGradeSubmission = async (submissionId) => {
        if (grade === '' || grade > 20 || grade < 0) {
            alert('Veuillez entrer une note valide entre 0 et 20');
            return;
        }

        try {
            await axios.put(`http://localhost:8080/api/submissions/${submissionId}/grade`, JSON.stringify({ grade: parseFloat(grade) }), {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            const updatedSubmissions = submissions.map(sub => 
                sub.id === submissionId ? { ...sub, grade: parseFloat(grade) } : sub
            );
            setSubmissions(updatedSubmissions);
            toast.success("Note ajoutée avec succès");
            setSelectedSubmission(null);
            setGrade('');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la note:', error);
            toast.error("Erreur lors de la sauvegarde de la note");
        }
    };

    const handleOpenSubmitModal = () => {
        setIsSubmitModalOpen(true);
    };

    const handleCloseSubmitModal = () => {
        setIsSubmitModalOpen(false);
        setNewSubmissionFile(null);
    };

    const handleOpenGradeModal = (submission) => {
        setSelectedSubmission(submission);
        setGrade(submission.grade || '');
    };

    const handleCloseGradeModal = () => {
        setSelectedSubmission(null);
        setGrade('');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const formattedDeadline = format(new Date(assignment.deadline), "dd MMMM yyyy 'à' HH:mm", { locale: fr });

    const GradeProgressBar = ({ grade, maxGrade = 20 }) => {
        const normalizeGrade = (value) => (value / maxGrade) * 100;
    
        return grade > 0 ? (
            <Tooltip title={`Note: ${grade}/${maxGrade}`} placement="top" arrow>
                <Box mt={2}>
                    <Typography variant="body1" gutterBottom>
                        Note : {grade} / {maxGrade}
                    </Typography>
                    <LinearProgress variant="determinate" value={normalizeGrade(grade)} />
                </Box>
            </Tooltip>
        ) : (
            <Typography variant="body1" gutterBottom mt={2}>
                Non noté
            </Typography>
        );
    };

    return (
        <Container className="container">
            <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
            </IconButton>

            <Box className="card">
                <Typography variant="h4" gutterBottom>{assignment.title}</Typography>
                <Typography variant="body1" gutterBottom>{assignment.description}</Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '0.8rem' }}>Date limite : {formattedDeadline}</Typography>
                {user.role === 'STUDENT' ? (
                    submission ? (
                        <Box mt={4}>
                            <Typography variant="h6">Votre rendu</Typography>
                            <Card className="card">
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} md={6}>
                                            <Button 
                                                variant="contained" 
                                                color="success" 
                                                href={submission.fileUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                fullWidth
                                            >
                                                Télécharger le fichier
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Button 
                                                variant="contained" 
                                                color="warning" 
                                                onClick={handleOpenSubmitModal}
                                                fullWidth
                                            >
                                                Modifier le fichier
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <GradeProgressBar grade={submission.grade} />
                                </CardContent>
                            </Card>
                        </Box>
                    ) : (
                        <Box mt={4}>
                            <Button variant="contained" color="primary" onClick={handleOpenSubmitModal}>
                                Soumettre le devoir
                            </Button>
                        </Box>
                    )
                ) : (
                    <Box mt={4}>
                        <Typography variant="h6">Rendu des étudiants</Typography>
                        {submissions.length > 0 ? (
                            submissions.map(sub => (
                                <Card className="card" key={sub.id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="body1">Étudiant : {sub.student.firstName} {sub.student.lastName}</Typography>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={12} md={6}>
                                                <Button 
                                                    variant="contained" 
                                                    color="success" 
                                                    href={sub.fileUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    fullWidth
                                                >
                                                    Télécharger le fichier
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Button 
                                                    variant="contained" 
                                                    color="primary" 
                                                    onClick={() => handleOpenGradeModal(sub)}
                                                    fullWidth
                                                >
                                                    Noter
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        <GradeProgressBar grade={sub.grade} />
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Typography variant="body1">Aucun rendu pour le moment</Typography>
                        )}
                    </Box>
                )}
            </Box>
            <Dialog open={isSubmitModalOpen} onClose={handleCloseSubmitModal}>
                <DialogTitle>Soumettre le devoir</DialogTitle>
                <DialogContent>
                    <input
                        accept=".pdf,.doc,.docx"
                        className="file-input"
                        id="raised-button-file"
                        type="file"
                        onChange={handleNewSubmissionFileChange}
                    />
                    <label htmlFor="raised-button-file" className="file-input-label">
                        Sélectionner un fichier
                    </label>
                    {newSubmissionFile && <Typography>{newSubmissionFile.name}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSubmitModal} color="secondary">
                        Annuler
                    </Button>
                    <Button onClick={handleSubmitAssignment} color="primary">
                        Soumettre
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={Boolean(selectedSubmission)} onClose={handleCloseGradeModal}>
                <DialogTitle>Noter le devoir</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="grade"
                        label="Note"
                        type="number"
                        fullWidth
                        value={grade}
                        onChange={(e) => setGrade(Math.min(20, Math.max(0, e.target.value)))}
                        inputProps={{ min: 0, max: 20 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseGradeModal} color="secondary">
                        Annuler
                    </Button>
                    <Button onClick={() => handleGradeSubmission(selectedSubmission.id)} color="primary">
                        Sauvegarder
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </Container>
    );
};

export default AssignmentDetails;
