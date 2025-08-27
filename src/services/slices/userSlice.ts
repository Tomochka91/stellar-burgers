import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TRegisterData,
  updateUserApi
} from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

export interface IUserState {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  user: TUser | null;
  registerUserError: string | null;
  loginUserRequest: boolean;
}

const initialState: IUserState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  registerUserError: null,
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
  return response.user;
});

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: Omit<TRegisterData, 'name'>) => {
    const response = await loginUserApi({ email, password });
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => {
    const response = await updateUserApi(user);
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
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isAuthChecked = true;
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
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
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

export const { userLogout, authChecked } = userSlice.actions;

export const {
  selectUser,
  selectRegisterError,
  selectIsAuthenticated,
  selectIsAuthChecked
} = userSlice.selectors;

export default userSlice.reducer;
