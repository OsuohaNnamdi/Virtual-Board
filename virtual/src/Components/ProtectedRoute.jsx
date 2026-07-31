import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

export default function ProtectedRoute({ children, requireAdmin, requireService, requireLevel = 'READ' }) {
  const { isAuthenticated, isAdmin, hasAccess, grantsLoaded } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;

  if (requireService) {
    if (!grantsLoaded) return <Spinner fullPage />;
    if (!hasAccess(requireService, requireLevel)) {
      return <Navigate to="/request-access" state={{ service: requireService, level: requireLevel }} replace />;
    }
  }

  return children;
}
