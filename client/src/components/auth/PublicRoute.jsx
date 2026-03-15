import { Navigate, Outlet } from 'react-router-dom';

function PublicRoute({ user, redirect = "/home" }) {
    return user ? <Navigate to={redirect} replace /> : <Outlet />;
}

export default PublicRoute;