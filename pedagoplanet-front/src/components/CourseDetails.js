import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 
import { Button, Container, Box, Typography, Card, CardContent, IconButton, Drawer, List, ListItem, ListItemText, Divider, Modal, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Grow, Grid } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Download as DownloadIcon, People as PeopleIcon, Add as AddIcon, Grade as GradeIcon, AccountCircle as AccountCircleIcon, Output as OutputIcon } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { UserContext } from '../contexts/UserProviderWithNavigate';
import AWS from 'aws-sdk';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from '../components/assets/courselist-background.jpg';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const CourseDetails = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [materialToDelete, setMaterialToDelete] = useState(null);
    const [materialToEdit, setMaterialToEdit] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(true); 
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [editSection, setEditSection] = useState(null);
    const [editCourseName, setEditCourseName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editContent, setEditContent] = useState('');

    const [newMaterialName, setNewMaterialName] = useState('');
    const [newMaterialFile, setNewMaterialFile] = useState(null);
    const [editMaterialName, setEditMaterialName] = useState('');

    const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
    const [newAssignmentDescription, setNewAssignmentDescription] = useState('');
    const [newAssignmentDeadline, setNewAssignmentDeadline] = useState('');

    const [conferenceUrl, setConferenceUrl] = useState('');
    const [newConferenceUrl, setNewConferenceUrl] = useState('');

    const [isUnenrollDialogOpen, setIsUnenrollDialogOpen] = useState(false);


    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const courseResponse = await axios.get(`http://localhost:8080/api/courses/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                setCourse(courseResponse.data);

                const materialsResponse = await axios.get(`http://localhost:8080/api/materials/course/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                setMaterials(materialsResponse.data);

                const assignmentsResponse = await axios.get(`http://localhost:8080/api/assignments/course/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                setAssignments(assignmentsResponse.data);

                const participantsResponse = await axios.get(`http://localhost:8080/api/courses/${courseId}/participants`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                setParticipants(participantsResponse.data);

                const conferenceResponse = await axios.get(`http://localhost:8080/api/courses/${courseId}/conference-url`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                setConferenceUrl(conferenceResponse.data.conferenceUrl);

            } catch (error) {
                console.error("Il y avait une erreur lors de la récupération des détails du cours:", error);
            } finally {
                setLoading(false); 
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    const openModal = (materialId) => {
        setMaterialToDelete(materialId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setMaterialToDelete(null);
    };

    const handleDeleteMaterial = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/materials/${materialToDelete}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            setMaterials(materials.filter(material => material.id !== materialToDelete));
            closeModal();
            toast.success("Support supprimé avec succès");
        } catch (error) {
            console.error('Erreur lors de la suppression du support:', error);
            toast.error("Erreur lors de la suppression du support");
        }
    };

    const handleEditSection = (section, material = null) => {
        setEditSection(section);
        if (section === 'general') {
            setEditCourseName(course.courseName || '');
            setEditDescription(course.description || '');
        } else if (section === 'editMaterial' && material) {
            setMaterialToEdit(material);
            setEditMaterialName(material.name);
        } else if (section === 'conferenceUrl') {
            setNewConferenceUrl(conferenceUrl || '');
        } else {
            setEditContent(course[section] || '');
        }
    };

    const handleEditSave = async () => {
        try {
            if (editSection === 'general') {
                await axios.put(`http://localhost:8080/api/courses/${courseId}`, 
                    { 
                        courseName: editCourseName || course.courseName,
                        description: editDescription || course.description 
                    }, 
                    {
                        headers: {
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                        }
                    }
                );
                setCourse({ ...course, courseName: editCourseName, description: editDescription });
                toast.success("Informations générales mises à jour avec succès");
            } else if (editSection === 'editMaterial') {
                await axios.put(`http://localhost:8080/api/materials/${materialToEdit.id}`, 
                    { 
                        name: editMaterialName 
                    }, 
                    {
                        headers: {
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                        }
                    }
                );
                setMaterials(materials.map(material => 
                    material.id === materialToEdit.id ? { ...material, name: editMaterialName } : material
                ));
                toast.success("Nom du support mis à jour avec succès");
            } else if (editSection === 'conferenceUrl') {
                await axios.put(`http://localhost:8080/api/courses/${courseId}/conference-url`, 
                    { 
                        conferenceUrl: newConferenceUrl 
                    }, 
                    {
                        headers: {
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                        }
                    }
                );
                setConferenceUrl(newConferenceUrl);
                setNewConferenceUrl('');
                toast.success("URL de visio-conférence mise à jour avec succès");
            } else {
                await axios.put(`http://localhost:8080/api/courses/${courseId}`, { [editSection]: editContent }, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                setCourse({ ...course, [editSection]: editContent });
            }
            setEditSection(null);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du cours:', error);
            toast.error("Erreur lors de la mise à jour du cours");
        }
    };

    const handleEditCancel = () => {
        setEditSection(null);
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleParticipantClick = (participantId) => {
        navigate(`/profile/${participantId}`);
    };

    const handleNewMaterialFileChange = (event) => {
        setNewMaterialFile(event.target.files[0]);
    };

    const handleNewMaterialSave = async () => {
        if (!newMaterialName || !newMaterialFile) {
            alert('Veuillez remplir tous les champs');
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
            Key: newMaterialFile.name,
            Body: newMaterialFile
        };

        try {
            console.log('Téléchargement du fichier sur S3 avec les paramètres:', params);
            const uploadResult = await s3.upload(params).promise();
            const fileUrl = uploadResult.Location;
            console.log('Fichier téléchargé sur S3:', fileUrl);

            const materialPayload = {
                name: newMaterialName,
                url: fileUrl,
                courseId: courseId
            };
            console.log('Sauvegarde du support sur le backend avec les données:', materialPayload);

            await axios.post(`http://localhost:8080/api/materials`, materialPayload, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });

            console.log('Support sauvegardé sur le backend. Rafraîchissement de la liste des supports.');
            const materialsResponse = await axios.get(`http://localhost:8080/api/materials/course/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            setMaterials(materialsResponse.data);

            setNewMaterialName('');
            setNewMaterialFile(null);
            setEditSection(null);
            toast.success("Support ajouté avec succès");
        } catch (error) {
            console.error('Erreur lors de l\'ajout du support:', error);
            if (error.response) {
                console.error('Erreur de réponse:', error.response.data);
            } else if (error.request) {
                console.error('Erreur de requête:', error.request);
            } else {
                console.error('Erreur générale:', error.message);
            }
            toast.error("Erreur lors de l'ajout du support. Vérifiez les journaux pour plus de détails.");
        }
    };

    const handleNewAssignmentSave = async () => {
        if (!newAssignmentTitle || !newAssignmentDescription || !newAssignmentDeadline) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        const assignmentPayload = {
            title: newAssignmentTitle,
            description: newAssignmentDescription,
            deadline: newAssignmentDeadline,
            courseId: courseId
        };

        try {
            await axios.post(`http://localhost:8080/api/assignments`, assignmentPayload, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });

            const assignmentsResponse = await axios.get(`http://localhost:8080/api/assignments/course/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            setAssignments(assignmentsResponse.data);

            setNewAssignmentTitle('');
            setNewAssignmentDescription('');
            setNewAssignmentDeadline('');
            setEditSection(null);
            toast.success("Devoir ajouté avec succès");
        } catch (error) {
            console.error('Erreur lors de l\'ajout du devoir:', error);
            toast.error("Erreur lors de l'ajout du devoir");
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    const handleViewProfile = () => {
        if (course && course.teacherId) {
            navigate(`/profile/${course.teacherId}`);
        } else {
            console.error('Teacher ID is undefined');
        }
    };

    const handleUnenroll = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/courses/${courseId}/unenroll`, {
                headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
            });
            toast.success("Vous êtes désinscrit du cours.");
            navigate("/available-courses");
        } catch (error) {
            console.error("Erreur lors de la désinscription:", error);
            toast.error("Erreur lors de la désinscription.");
        }
        setIsUnenrollDialogOpen(false);
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
                <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIcon />
                </IconButton>
                    {course ? (
                        <>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h4">{course.courseName}</Typography>
                                <Box>
                                    <Button variant="contained" color="primary" onClick={toggleDrawer(true)}>
                                        <PeopleIcon /> Participants
                                    </Button>
                                    {user && user.role === 'STUDENT' && (
                                        <Button variant="contained" color="primary" onClick={handleViewProfile} sx={{ ml: 2 }}>
                                            <AccountCircleIcon /> Contacter l'enseignant
                                        </Button>
                                    )}
                                    {user && user.role === 'STUDENT' && (
                                        <Button variant="contained" color="error" onClick={() => setIsUnenrollDialogOpen(true)} sx={{ ml: 2 }}>
                                            <OutputIcon /> Se désinscrire
                                        </Button>
                                    )}

                                    {user && user.role === 'TEACHER' && (
                                        <Button variant="contained" color="primary" onClick={() => navigate(`/courses/${courseId}/student-grades`)} sx={{ ml: 2 }}>
                                            <GradeIcon /> Notes
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                            <Box mb={4}>
                                <Typography variant="h5" gutterBottom>Généralités</Typography>
                                <Typography variant="body1">{course.description}</Typography>
                                {user && user.role === 'TEACHER' && (
                                    <Box mt={2}>
                                        <IconButton onClick={() => handleEditSection('general')} color="primary">
                                            <EditIcon />
                                        </IconButton>
                                    </Box>
                                )}
                            </Box>
                            <Box mb={4}>
                                <Typography variant="h5" gutterBottom>Supports de cours</Typography>
                                {user && user.role === 'TEACHER' && (
                                    <Button onClick={() => handleEditSection('newMaterial')} color="primary">
                                        <AddIcon /> Ajouter
                                    </Button>
                                )}
                                {materials.length > 0 ? (
                                    materials.map(material => (
                                        <Card key={material.id} sx={{ mb: 2 }}>
                                            <CardContent>
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="h6">{material.name}</Typography>
                                                    <Box>
                                                        <IconButton component="a" href={material.url} target="_blank" rel="noopener noreferrer" color="primary" onClick={() => toast.info("Support téléchargé")}>
                                                            <DownloadIcon />
                                                        </IconButton>
                                                        {user && user.role === 'TEACHER' && (
                                                            <>
                                                                <IconButton onClick={() => handleEditSection('editMaterial', material)} color="primary">
                                                                    <EditIcon />
                                                                </IconButton>
                                                                <IconButton onClick={() => openModal(material.id)} color="secondary">
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <Typography variant="body1">Pas de support disponible</Typography>
                                )}
                            </Box>
                            <Box mb={4}>
                               <Typography variant="h5" gutterBottom>Devoirs</Typography>
                                {user && user.role === 'TEACHER' && (
                                <Button onClick={() => handleEditSection('newAssignment')} color="primary" sx={{ mb: 2 }}>
                               <AddIcon /> Ajouter un devoir
                              </Button>
                            )}
                           {assignments.length > 0 ? (
                           <Grid container spacing={2}>
                           {assignments.map(assignment => (
                            <Grid item xs={12} sm={6} md={4} key={assignment.id}>
                            <Card sx={{
                            transition: 'transform 0.3s, box-shadow 0.3s','&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 6px 10px rgba(0,0,0,0.2)',
                        },
                    }}>
                        <ListItem button onClick={() => navigate(`/assignments/${assignment.id}`)} sx={{ textDecoration: 'none', color: 'inherit' }}>
                            <ListItemText
                                primary={(
                                    <Typography variant="h6" sx={{ color: '#4caf50' }}>
                                        {assignment.title}
                                    </Typography>
                                    )}
                                secondary={(
                                <Typography variant="body1" color="textSecondary">
                                {`Échéance : ${format(new Date(assignment.deadline), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}`}
                                </Typography>
                                )}
                                />
                        </ListItem>
                        </Card>
                        </Grid>
                        ))}
                        </Grid>
                        ) : (
                        <Typography variant="body1">Pas de devoir ajouté</Typography>
                        )}
                        </Box>

                            <Box mt={4}>
                                <Typography variant="h5" gutterBottom>Visio-conférence</Typography>
                                {conferenceUrl ? (
                                    <Button variant="contained" color="primary" href={conferenceUrl} target="_blank" sx={{ mt: 2 }}>
                                        Rejoindre la visio-conférence
                                    </Button>
                                ) : (
                                    <Typography variant="body1">Pas de visio-conférence disponible</Typography>
                                )}
                                {user && user.role === 'TEACHER' && (
                                    <Box mt={2}>
                                        <Button onClick={() => handleEditSection('conferenceUrl')} color="primary">
                                            <AddIcon /> Ajouter/Modifier l'URL de visio-conférence
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </>
                    ) : (
                        <Typography variant="h6" color="error">Erreur de chargement des détails du cours. Veuillez réessayer.</Typography>
                    )}

                    <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                            <List>
                                {participants.length > 0 ? (
                                    participants.map(participant => (
                                        <ListItem button key={participant.id} onClick={() => handleParticipantClick(participant.id)}>
                                            <ListItemText primary={`${participant.firstName} ${participant.lastName}`} />
                                        </ListItem>
                                    ))
                                ) : (
                                    <ListItem>
                                        <ListItemText primary="Pas de participants disponibles" />
                                    </ListItem>
                                )}
                            </List>
                            <Divider />
                        </Box>
                    </Drawer>

                    <Modal
                        open={isModalOpen}
                        onClose={closeModal}
                    >
                        <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 1 }}>
                            <Typography variant="h6" gutterBottom>Confirmation de suppression</Typography>
                            <Typography variant="body1" gutterBottom>Êtes-vous sûr de vouloir supprimer cet élément ?</Typography>
                            <Box display="flex" justifyContent="space-between">
                                <Button onClick={handleDeleteMaterial} color="primary">Oui</Button>
                                <Button onClick={closeModal} color="secondary">Non</Button>
                            </Box>
                        </Box>
                    </Modal>

                    <Dialog open={isUnenrollDialogOpen} onClose={() => setIsUnenrollDialogOpen(false)}>
                        <DialogTitle>Confirmer la désinscription</DialogTitle>
                        <DialogContent>
                        <Typography>Êtes-vous sûr de vouloir vous désinscrire de ce cours ?</Typography>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={() => setIsUnenrollDialogOpen(false)} color="secondary">
                         Non
                        </Button>
                        <Button onClick={handleUnenroll} color="primary">
                         Oui
                        </Button>
                    </DialogActions>
                    </Dialog>

                    <Dialog open={Boolean(editSection)} onClose={handleEditCancel}>
                        <DialogTitle>{editSection === 'newMaterial' ? 'Ajouter un matériel' : editSection === 'newAssignment' ? 'Ajouter un devoir' : `Modifier ${editSection === 'general' ? 'Informations générales' : 'Support'}`}</DialogTitle>
                        <DialogContent>
                            {editSection === 'general' ? (
                                <>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="edit-courseName"
                                        label="Nom du cours"
                                        type="text"
                                        fullWidth
                                        value={editCourseName}
                                        onChange={(e) => setEditCourseName(e.target.value)}
                                    />
                                    <TextField
                                        margin="dense"
                                        id="edit-description"
                                        label="Description"
                                        type="text"
                                        fullWidth
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                    />
                                </>
                            ) : editSection === 'newMaterial' ? (
                                <>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="new-material-name"
                                        label="Nom du support"
                                        type="text"
                                        fullWidth
                                        value={newMaterialName}
                                        onChange={(e) => setNewMaterialName(e.target.value)}
                                    />
                                    <input
                                        accept="application/pdf"
                                        style={{ display: 'none' }}
                                        id="raised-button-file"
                                        type="file"
                                        onChange={handleNewMaterialFileChange}
                                    />
                                    <label htmlFor="raised-button-file">
                                        <Button variant="contained" component="span">
                                            Télécharger PDF
                                        </Button>
                                        {newMaterialFile && newMaterialFile.name}
                                    </label>
                                </>
                            ) : editSection === 'newAssignment' ? (
                                <>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="new-assignment-title"
                                        label="Titre du devoir"
                                        type="text"
                                        fullWidth
                                        value={newAssignmentTitle}
                                        onChange={(e) => setNewAssignmentTitle(e.target.value)}
                                    />
                                    <TextField
                                        margin="dense"
                                        id="new-assignment-description"
                                        label="Description du devoir"
                                        type="text"
                                        fullWidth
                                        value={newAssignmentDescription}
                                        onChange={(e) => setNewAssignmentDescription(e.target.value)}
                                    />
                                    <TextField
                                        margin="dense"
                                        id="new-assignment-deadline"
                                        label="Date limite"
                                        type="datetime-local"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        value={newAssignmentDeadline}
                                        onChange={(e) => setNewAssignmentDeadline(e.target.value)}
                                    />
                                </>
                            ) : editSection === 'editMaterial' ? (
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="edit-material-name"
                                    label="Nom du support"
                                    type="text"
                                    fullWidth
                                    value={editMaterialName}
                                    onChange={(e) => setEditMaterialName(e.target.value)}
                                />
                            ) : editSection === 'conferenceUrl' ? (
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="edit-conference-url"
                                    label="URL de visio-conférence"
                                    type="text"
                                    fullWidth
                                    value={newConferenceUrl}
                                    onChange={(e) => setNewConferenceUrl(e.target.value)}
                                />
                            ) : (
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="edit-content"
                                    label="Contenu"
                                    type="text"
                                    fullWidth
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                />
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleEditCancel} color="secondary">
                                Annuler
                            </Button>
                            <Button onClick={editSection === 'newMaterial' ? handleNewMaterialSave : editSection === 'newAssignment' ? handleNewAssignmentSave : handleEditSave} color="primary">
                                Sauvegarder
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Grow>
            <ToastContainer />
        </Box>
    );
};

export default CourseDetails;
