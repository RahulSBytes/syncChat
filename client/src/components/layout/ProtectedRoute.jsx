import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ user }) {
    !user ? <Navigate to="/login" replace /> : <Outlet />;
}

export default ProtectedRoute;