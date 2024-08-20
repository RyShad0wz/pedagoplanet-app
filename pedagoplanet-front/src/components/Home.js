import React, { useEffect, useState } from 'react';
import { Container, Box, Button, Typography, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import backgroundImage from './assets/carbon_footprint.jpg';
import logo from './assets/logo.png';

const CustomArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: 'block', background: 'green', height: '50px', width: '50px', borderRadius: '25px', zIndex: 1 }}
            onClick={onClick}
        />
    );
};

const Home = () => {
    const [news, setNews] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('https://api.currentsapi.services/v1/search', {
                    params: {
                        apiKey: 'LTQqqhsNQRpT1c8vrGLUmuRcTFfHWUMSbyyiLXaPSFFgw3Wq',
                        language: 'fr',
                        keywords: 'écologie'
                    }
                });
                setNews(response.data.news.map(article => ({
                    title: article.title,
                    content: article.description,
                    date: new Date(article.published).toLocaleDateString('fr-FR')
                })));
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des actualités:', error);
                setLoading(false); 
            }
        };

        fetchNews();
    }, []);

    const handleOpenDialog = (newsItem) => {
        setSelectedNews(newsItem);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedNews(null);
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        prevArrow: <CustomArrow />,
        nextArrow: <CustomArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    if (loading) {
        return (
            <Box 
                sx={{ 
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container
            maxWidth={false}
            disableGutters
            sx={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Roboto, sans-serif',
                padding: '1rem'
            }}
        >
            <Box
                sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    p: { xs: 2, md: 4 },
                    borderRadius: 2,
                    textAlign: 'center',
                    mb: 4,
                    width: { xs: '100%', md: '80%' },
                    transition: 'opacity 1s ease-in-out',
                    opacity: loading ? 0 : 1
                }}
            >
                <Typography variant="h2" sx={{ fontWeight: 'bold', fontSize: { xs: '2rem', md: '3.5rem' } }} gutterBottom>
                    Bienvenue sur PedaGoPlanet
                </Typography>
                <img src={logo} alt="PedaGoPlanet Logo" style={{ width: '100px', margin: '20px 0' }} />
                <Typography variant="h4" sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }} gutterBottom>
                    La plateforme d'apprentissage accessible dans toute la planète !
                </Typography>
                <Typography variant="h4" sx={{ fontSize: { xs: '0.8rem', md: '1.2rem' } }} gutterBottom>
                    Ensemble pour un avenir durable
                </Typography>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 4,
                    flexDirection: { xs: 'column', sm: 'row' }
                }}
            >
                <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    color="success"
                    sx={{ fontSize: '1rem', padding: '0.5rem 1.5rem' }}
                >
                    Connexion
                </Button>
                <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    color="warning"
                    sx={{ fontSize: '1rem', padding: '0.5rem 1.5rem' }}
                >
                    Créer un compte
                </Button>
            </Box>

            <Box
                sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    p: 4,
                    borderRadius: 2,
                    textAlign: 'center',
                    mb: 4,
                    width: { xs: '100%', md: '80%' },
                    transition: 'opacity 1s ease-in-out',
                    opacity: loading ? 0 : 1
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2rem' } }} gutterBottom>
                    What's Up Planet ?
                </Typography>
                <Slider {...settings}>
                    {news.map((article, index) => (
                        <div key={index}>
                            <Card sx={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', m: 1 }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {article.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 2 }}>
                                        {article.content.length > 100 ? `${article.content.substring(0, 100)}...` : article.content}
                                    </Typography>
                                    <Typography variant="caption" display="block" sx={{ mt: 2, fontStyle: 'italic' }}>
                                        {article.date}
                                    </Typography>
                                </CardContent>
                                <Button onClick={() => handleOpenDialog(article)} sx={{ alignSelf: 'center', mb: 2 }}>
                                    Lire la suite
                                </Button>
                            </Card>
                        </div>
                    ))}
                </Slider>
            </Box>

            <Box
                sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                    p: 4,
                    borderRadius: 2,
                    textAlign: 'center',
                    width: { xs: '100%', md: '80%' },
                    transition: 'opacity 1s ease-in-out',
                    opacity: loading ? 0 : 1
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '2rem', md: '3rem' } }} gutterBottom>
                    Qui sommes-nous ?
                </Typography>
                <img src={logo} alt="PedaGoPlanet Logo" style={{ width: '150px', margin: '20px 0' }} />
                <Typography variant="body1" sx={{ fontSize: { xs: '1rem', md: '2rem' } }}>
                    PedaGoPlanet a été conçue pour faciliter la transition numérique écologique dans l'éducation. 
                    <br /><br />
                    Notre mission est de rendre l'apprentissage accessible à tous, tout en promouvant des pratiques écologiques et durables.
                    <br /><br />
                    Nous sommes engagés à fournir une plateforme innovante qui permet aux enseignants de partager leurs ressources et d'instruire leurs élèves n'importe quand et n'importe où.
                    <br /><br />
                    Avec PedaGoPlanet, restez connectés, restez concentrés !
                </Typography>
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{selectedNews?.title}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        {selectedNews?.content}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 2, fontStyle: 'italic' }}>
                        {selectedNews?.date}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Home;
