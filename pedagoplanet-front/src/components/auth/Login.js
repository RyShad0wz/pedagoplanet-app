import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserProviderWithNavigate';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Avatar,
    CssBaseline,
    Grid,
    Link,
    createTheme,
    ThemeProvider
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
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

function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', formData);
            const token = response.data.token;
            const role = response.data.role;
            sessionStorage.setItem('token', token);
    
            const userResponse = await axios.get('http://localhost:8080/api/auth/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            const userId = userResponse.data.id;
            sessionStorage.setItem('userId', userId);
            const userData = {
                ...userResponse.data,
                role,
                token
            };
    
            setUser(userData);
    
            if (role === 'STUDENT') {
                navigate('/student-dashboard');
            } else if (role === 'TEACHER') {
                navigate('/teacher-dashboard');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion', error);
        }
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
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Connexion
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Nom d'utilisateur"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Mot de passe"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Se Connecter
                        </Button>
                        <Grid container justifyContent="center">
                            <Grid item>
                                <Typography variant="body2" align="center">
                                    Vous n'avez pas de compte ?{' '}
                                    <Link href="/register" variant="body2">
                                        Inscrivez-vous
                                    </Link>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Login;
