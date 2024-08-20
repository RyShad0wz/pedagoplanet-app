import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Button, Typography, CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import backgroundImage from '../assets/student-dashboard.jpg';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4caf50', 
        },
        secondary: {
            main: '#388e3c', 
        },
    },
});

function RoleSelection() {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        navigate(`/register/${role}`);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container
                component="main"
                maxWidth={false}
                disableGutters
                sx={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2,
                }}
            >
                <CssBaseline />
                <Box
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        padding: 4,
                        borderRadius: 2,
                        boxShadow: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: 400,
                    }}
                >
                    <Typography component="h1" variant="h5" align="center">
                        Inscription - PedaGoPlanet
                    </Typography>
                    <Box sx={{ mt: 4 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => handleRoleSelect('STUDENT')}
                            sx={{ mb: 2 }}
                        >
                            Je suis un(e) étudiant(e)
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => handleRoleSelect('TEACHER')}
                            sx={{ mb: 2 }}
                        >
                            Je suis un(e) enseignant(e)
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default RoleSelection;
