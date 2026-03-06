import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 * @param {string[]} allowedRoles - roles allowed to access this route
 * If no allowedRoles provided, any authenticated user can access.
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--dark-bg)' }}>
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect to their own dashboard
        const dashMap = { admin: '/admin', staff: '/staff', user: '/dashboard' };
        return <Navigate to={dashMap[user.role] || '/login'} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
