import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/UserProviderWithNavigate';
import { Container, Typography, Grid, Card, CardContent, CircularProgress, Box, Grow } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { format } from 'date-fns';
import backgroundImage from '../components/assets/courselist-background.jpg';

const useStyles = makeStyles({
    postIt: {
        backgroundColor: '#ef870a',
        padding: '16px',
        margin: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 6px 10px rgba(0,0,0,0.2)'
        }
    },
    postItTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '8px'
    },
    postItContent: {
        fontSize: '16px',
        marginBottom: '8px'
    },
    postItDate: {
        fontSize: '14px',
        color: '#555'
    }
});

const StudentNews = () => {
    const classes = useStyles();
    const { user } = useContext(UserContext);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.id) {
            axios.get(`http://localhost:8080/api/news/student/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            })
            .then(response => {
                setNews(response.data);
            })
            .catch(error => {
                console.error('Error fetching news:', error);
            })
            .finally(() => {
                setLoading(false);
            });
        }
    }, [user]);

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
            ) : news.length > 0 ? (
                <Grow in={!loading}>
                    <Container sx={{ mt: 4, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 2, p: 3 }}>
                        <Typography variant="h4" gutterBottom>Actualités</Typography>
                        <Grid container spacing={3}>
                            {news.map(item => (
                                <Grid item xs={12} sm={6} md={4} key={item.id}>
                                    <Card className={classes.postIt}>
                                        <CardContent>
                                            <Typography className={classes.postItTitle} gutterBottom>
                                                {item.courseName}
                                            </Typography>
                                            <Typography className={classes.postItContent}>
                                                {item.title}
                                            </Typography>
                                            <Typography className={classes.postItContent}>
                                                {item.content}
                                            </Typography>
                                            <Typography className={classes.postItDate}>
                                                {format(new Date(item.createdAt), 'dd/MM/yyyy')}
                                            </Typography>
                                            <Typography variant="caption" display="block" gutterBottom>
                                                {item.teacherGenre === 'HOMME' ? 'Monsieur' : 'Madame'} {item.teacherName}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Grow>
            ) : (
                <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 2, p: 3 }}>
                    <Typography sx={{ fontSize: '24px' }} variant="h5">Aucune actualité disponible pour le moment.</Typography>
                </Container>
            )}
        </Box>
    );
};    

export default StudentNews;
