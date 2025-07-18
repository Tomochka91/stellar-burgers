import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  loginUser,
  selectIsAuthenticated,
  selectUser
} from '../../services/slices/userSlice';
import { Navigate } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    setEmail(localStorage.getItem('email') ?? '');
  }, []);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!email || !password) return;

    dispatch(loginUser({ email, password }));

    localStorage.setItem('email', email);
  };

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
