import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Divider, Box, Menu, MenuItem, TextField, Button, ListItemAvatar, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ContactsIcon from '@mui/icons-material/Contacts';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ClassIcon from '@mui/icons-material/Class';
import GradeIcon from '@mui/icons-material/Grade';
import NewsIcon from '@mui/icons-material/Newspaper';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CreateIcon from '@mui/icons-material/Create';
import primaryLogo from './assets/logo.png';
import { UserContext } from '../contexts/UserProviderWithNavigate';
import axios from 'axios';

function Header() {
    const { user, logout, notifications, setNotifications } = useContext(UserContext);
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

    const fetchContacts = useCallback(() => {
        if (user && user.id) {
            const savedContacts = localStorage.getItem(`contacts_${user.id}`);
            setContacts(savedContacts ? JSON.parse(savedContacts) : []);
        }
    }, [user]);

    const saveContacts = useCallback(() => {
        if (user && user.id) {
            localStorage.setItem(`contacts_${user.id}`, JSON.stringify(contacts));
        }
    }, [contacts, user]);

    const fetchNotifications = useCallback(async () => {
        if (user && user.id) {
            try {
                const response = await axios.get('http://localhost:8080/api/notifications', {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                        'userId': user.id.toString()
                    }
                });
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        }
    }, [setNotifications, user]);

    useEffect(() => {
        fetchContacts();
    }, [user, fetchContacts]);

    useEffect(() => {
        saveContacts();
    }, [contacts, user, saveContacts]);

    useEffect(() => {
        fetchNotifications();
    }, [user, fetchNotifications]);

    const handleLogoClick = () => {
        if (user) {
            switch (user.role) {
                case 'STUDENT':
                    navigate('/student-dashboard');
                    break;
                case 'TEACHER':
                    navigate('/teacher-dashboard');
                    break;
                default:
                    navigate('/');
            }
        } else {
            navigate('/');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        logout();
        navigate('/');
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationOpen = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };

    const handleSearchChange = async (event) => {
        setSearchTerm(event.target.value);
        if (event.target.value.length > 0) {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/search?query=${event.target.value}`);
                setSearchResults(response.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleAddContactClick = (user) => {
        setSelectedUser(user);
        setOpenConfirm(true);
    };

    const handleConfirmClose = () => {
        setOpenConfirm(false);
        setSelectedUser(null);
    };

    const handleAddContact = () => {
        setContacts((prevContacts) => [...prevContacts, selectedUser]);
        setOpenConfirm(false);
        setSelectedUser(null);
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleNotificationClick = async (notification) => {
        try {
            await axios.delete(`http://localhost:8080/api/notifications/${notification.id}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            setNotifications((prevNotifications) => prevNotifications.filter(n => n.id !== notification.id));
    
            if (notification.type === 'NEWS') {
                navigate(`/student-news`);
            } else {
                navigate(`/message/${user.id}/${notification.senderId}`);
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const renderMenuItems = () => {
        if (!user) {
            return (
                <>
                    <ListItem button component={Link} to="/" sx={{ '&:hover': { bgcolor: 'lightgreen', color: 'green' } }}>
                        <HomeIcon sx={{ marginRight: 2 }} />
                        <ListItemText primary="Accueil" />
                    </ListItem>
                    <ListItem button component={Link} to="/login" sx={{ '&:hover': { bgcolor: 'lightgreen', color: 'green' } }}>
                        <LoginIcon sx={{ marginRight: 2 }} />
                        <ListItemText primary="Connexion" />
                    </ListItem>
                    <ListItem button component={Link} to="/register" sx={{ '&:hover': { bgcolor: 'lightgreen', color: 'green' } }}>
                        <AppRegistrationIcon sx={{ marginRight: 2 }} />
                        <ListItemText primary="Inscription" />
                    </ListItem>
                </>
            );
        } else if (user.role === 'STUDENT') {
            return (
                <>
                    <ListItem button component={Link} to="/student-dashboard" sx={{ '&:hover': { bgcolor: 'lightgreen', color: 'green' } }}>
                        <DashboardIcon sx={{ marginRight: 2 }} />
                        <ListItemText primary="Tableau de bord" />
                    </ListItem>
                    <ListItem button component={Link} to="/available-courses" sx={{ '&:hover': { bgcolor: 'lightgreen', color: 'green' } }}>
                        <ClassIcon sx={{ marginRight: 2 }} />
                        <ListItemText primary="Cours" />
                    </ListItem>
                    <ListItem button component={Link} to="/student-dashboard/grades" sx={{ '&:hover': { bgcolor: 'lightgreen', color: 'green' } }}>
                        <GradeIcon sx={{ marginRight: 2 }} />
                        <ListItemText primary="Notes" />
                    </ListItem>
                    <ListItem button component={Link} to="/student-news" sx={{ '&:hover': { bgcolor: 'lightgreen', color: 'green' } }}>
                        <NewsIcon sx={{ marginRight: 2 }} />
                        <ListItemText primary="Actualités" />
                    </ListItem>
                    <ListItem button onClick={handleLogout} sx={{ '&:hover': { bgcolor: 'lightgreen', color: 'green' } }}>
                        <ExitToAppIcon sx={{ marginRight: 2 }} />
                        <ListItemText primary="Déconnexion" />
                    </ListItem>
                </>
            );
        } else if (user.role === 'TEACHER') {
            return (
                <>
                    <ListItem button component={Link} to="/teacher-dashboard" sx={{ '&:hover': { bgcolor: 'lightgreen', color: 'green' } }}>
                        <DashboardIcon sx={{ marginRight: 2 }} />
                        <ListItemText primary="Tableau de bord" />
                    </ListItem>
                    <ListItem button component={Link} to="/teacher-dashboard/courses" sx={{ '&:hover': { bgcolor: 'lightgreen', color: 'green' } }}>
                        <ClassIcon sx={{ marginRight: 2 }} />
                        <ListItemText primary="Mes Cours" />
                    </ListItem>
                    <ListItem button component={Link} to="/teacher-news" sx={{ '&:hover': { bgcolor: 'lightgreen', color: 'green' } }}>
                        <NewsIcon sx={{ marginRight: 2 }} />
                        <ListItemText primary="Mes Actualités" />
                    </ListItem>
                    <ListItem button component={Link} to="/create-news" sx={{ '&:hover': { bgcolor: 'lightgreen', color: 'green' } }}>
                        <CreateIcon sx={{ marginRight: 2 }} />
                        <ListItemText primary="Créer une Actualité" />
                    </ListItem>
                    <ListItem button onClick={handleLogout} sx={{ '&:hover': { bgcolor: 'lightgreen', color: 'green' } }}>
                        <ExitToAppIcon sx={{ marginRight: 2 }} />
                        <ListItemText primary="Déconnexion" />
                    </ListItem>
                </>
            );
        }
    };

    return (
        <AppBar position="fixed" sx={{ backgroundColor: '#89ec89', color: '#ffffff' }}>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleDrawer(true)}
                    className={`menu-icon ${drawerOpen ? 'open' : ''}`}
                    sx={{
                        transition: 'transform 0.3s ease-in-out',
                        transform: drawerOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <img
                    src={primaryLogo}
                    alt="PedaGoPlanet Logo"
                    style={{ cursor: 'pointer', marginRight: '20px', height: '60px' }}
                    onClick={handleLogoClick}
                />
                {user && (
                    <Typography variant="body1" sx={{ marginLeft: 2 }}>
                        Bienvenue {user.firstName}
                    </Typography>
                )}
                {user && (
                    <Box sx={{ flexGrow: 1 }} />
                )}
                {user && (
                    <>
                        <IconButton color="inherit" onClick={handleMenuOpen}>
                            <ContactsIcon />
                        </IconButton>
                        <IconButton color="inherit" onClick={handleNotificationOpen}>
                            <Badge badgeContent={notifications.length} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </>
                )}
                <Menu
                    id="contacts-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    sx={{ mt: '45px' }}
                >
                    <Box sx={{ p: 2 }}>
                        <TextField
                            label="Rechercher un contact"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            fullWidth
                        />
                    </Box>
                    {searchResults.map((result) => (
                        <MenuItem key={result.id}>
                            <ListItemAvatar>
                                <Avatar alt={result.firstName} src="/static/images/avatar/1.jpg" />
                            </ListItemAvatar>
                            <ListItemText primary={`${result.firstName} ${result.lastName}`} />
                            <IconButton edge="end" color="primary" onClick={() => handleAddContactClick(result)}>
                                <AddIcon />
                            </IconButton>
                        </MenuItem>
                    ))}
                    <Divider />
                    <Typography variant="subtitle1" sx={{ p: 2 }}>Mes Contacts</Typography>
                    {user && contacts.map((contact) => (
                        <MenuItem key={contact.id} component={Link} to={`/message/${user.id}/${contact.id}`} onClick={handleMenuClose}>
                            <ListItemAvatar>
                                <Avatar alt={contact.firstName} src="/static/images/avatar/1.jpg" />
                            </ListItemAvatar>
                            <ListItemText primary={`${contact.firstName} ${contact.lastName}`} />
                        </MenuItem>
                    ))}
                </Menu>
                <Dialog
                    open={openConfirm}
                    onClose={handleConfirmClose}
                >
                    <DialogTitle>Ajouter un contact</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Voulez-vous vraiment ajouter {selectedUser?.firstName} {selectedUser?.lastName} à vos contacts ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleConfirmClose} color="primary">
                            Annuler
                        </Button>
                        <Button onClick={handleAddContact} color="primary">
                            Ajouter
                        </Button>
                    </DialogActions>
                </Dialog>
                <Menu
                    id="notifications-menu"
                    anchorEl={notificationAnchorEl}
                    open={Boolean(notificationAnchorEl)}
                    onClose={handleNotificationClose}
                    sx={{ mt: '45px' }}
                >
                    <Typography variant="subtitle1" sx={{ p: 2 }}>Notifications</Typography>
                    {notifications.map((notification) => (
                        <MenuItem key={notification.id} onClick={() => handleNotificationClick(notification)}>
                            <ListItemText primary={notification.message} />
                        </MenuItem>
                    ))}
                </Menu>
            </Toolbar>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        marginTop: '64px',
                        width: '250px',
                    }
                }}
            >
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List>
                        {renderMenuItems()}
                    </List>
                    <Divider />
                </Box>
            </Drawer>
        </AppBar>
    );
}

export default Header;
