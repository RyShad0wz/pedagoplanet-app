import { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserProviderWithNavigate';

const RedirectBasedOnRole = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            if (location.pathname === '/login' || location.pathname === '/' || location.pathname === '/register') {
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
            }
        }
    }, [user, navigate, location.pathname]);

    return null;
};

export default RedirectBasedOnRole;
