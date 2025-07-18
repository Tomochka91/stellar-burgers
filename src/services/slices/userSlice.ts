import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TRegisterData,
  updateUserApi
} from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
// import { selectIsLoading } from './ingredientsSlice';

interface IUserState {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  user: TUser | null;
  registerUserError: string | null;
  loginUserError: string | null;
  loginUserRequest: boolean;
}

const initialState: IUserState = {
  user: null,
  isAuthChecked: false, // флаг для статуса проверки токена пользователя
  isAuthenticated: false,
  registerUserError: null,
  loginUserError: null,
  loginUserRequest: false
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const checkUser = createAsyncThunk('user/check', async () => {
  const response = await getUserApi();
  console.log(response);
  return response.user;
});

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: Omit<TRegisterData, 'name'>) => {
    const response = await loginUserApi({ email, password });
    console.log(response);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => {
    const response = await updateUserApi(user);
    console.log(response);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { dispatch }) =>
    await logoutApi().then(() => {
      localStorage.clear();
      deleteCookie('accessToken');
      dispatch(userLogout());
    })
);

// export const forgotPassword;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    userLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthChecked = true;
    }
  },
  selectors: {
    selectUser: (sliceState) => sliceState.user,
    // selectIsLoading: (sliceState) => sliceState.isLoading,
    selectRegisterError: (sliceState) => sliceState.registerUserError,
    selectIsAuthenticated: (sliceState) => sliceState.isAuthenticated,
    selectIsAuthChecked: (sliceState) => sliceState.isAuthChecked
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerUserError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.registerUserError = action.error.message || 'Failed to register';
        console.log('Registration error:', action.error.message);
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isAuthChecked = true;
        console.log('User saved:', action.payload);
      })
      .addCase(checkUser.pending, (state) => {
        state.isAuthChecked = false;
        state.loginUserRequest = true;
      })
      .addCase(checkUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isAuthChecked = true;
        state.loginUserRequest = false;
      })
      .addCase(checkUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.loginUserRequest = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message || 'Failed to login';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

// export const selectUserData = createSelector([(state: IUserState) => state.user])

export const { userLogout, authChecked } = userSlice.actions;

export const {
  selectUser,
  selectRegisterError,
  selectIsAuthenticated,
  selectIsAuthChecked
} = userSlice.selectors;

export default userSlice.reducer;
