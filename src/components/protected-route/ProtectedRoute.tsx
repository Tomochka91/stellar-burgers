import { Navigate, Outlet, useLocation } from 'react-router-dom';
import {
  selectIsAuthChecked,
  selectIsAuthenticated,
  selectUser
} from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth }: ProtectedRouteProps) => {
  const location = useLocation();

  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);

  if (!isAuthChecked) return <Preloader />;
  if (!onlyUnAuth && !user)
    return <Navigate to='/login' replace state={{ from: location }} />;
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return <Outlet />;
};
