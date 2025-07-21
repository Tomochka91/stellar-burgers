import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  loginUser,
  selectIsAuthenticated
} from '../../services/slices/userSlice';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from = location.state?.from || '/';
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    setEmail(localStorage.getItem('email') ?? '');
  }, []);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Пожалуйста, заполните все поля формы');
      return;
    }

    dispatch(loginUser({ email, password }));

    localStorage.setItem('email', email);

    setError('');
    navigate(from, { replace: true });
  };

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
