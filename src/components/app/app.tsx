import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate
} from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { fetchFeeds } from '../../services/slices/feedSlice';
import {
  checkUser,
  selectIsAuthenticated,
  selectUser
} from '../../services/slices/userSlice';
import { ProtectedRoute } from '../protected-route/ProtectedRoute';
// import { ProtectedRoute } from '../protected-route/ProtectedRoute';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const isAuthenticated = useSelector(selectIsAuthenticated);
  // console.log(isAuthenticated);
  // const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchFeeds());
    dispatch(checkUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        {/*Public Routes*/}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/feed/:number'
          element={
            <Modal
              title='BLABLABLA'
              onClose={() => {}}
              children={<OrderInfo />}
            />
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Modal
              title='Детали ингредиента'
              onClose={() => {
                navigate(-1);
              }}
              children={<IngredientDetails />}
            />
          }
        />

        {/*UnAuthorized Routes*/}
        <Route element={<ProtectedRoute onlyUnAuth />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>

        {/*Authorized Routes*/}
        <Route element={<ProtectedRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/orders' element={<ProfileOrders />} />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title='DADADA'
                onClose={() => {}}
                children={<OrderInfo />}
              />
            }
          />
        </Route>

        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  );
};

export default App;
