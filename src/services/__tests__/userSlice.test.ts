import userSliceReducer, {
  registerUser,
  checkUser,
  loginUser,
  updateUser,
  logoutUser,
  userLogout,
  authChecked,
  IUserState,
  initialState
} from '../slices/userSlice';
import { TUser } from '../../utils/types';
import { TRegisterData } from '../../utils/burger-api';

const testUser: TUser = {
  email: 'test@test.com',
  name: 'test'
};

const testRegisterData: TRegisterData = {
  email: 'test@test.com',
  name: 'test',
  password: '123456'
};

const testLoginData: Omit<TRegisterData, 'name'> = {
  email: testRegisterData.email,
  password: testRegisterData.password
};

describe('Тесты экшенов регистрации пользователя', () => {
  it('Проверка обработки начала запроса (Pending Register User)', () => {
    const pendingAction = registerUser.pending('', testRegisterData);
    const state = userSliceReducer(initialState, pendingAction);

    expect(state.registerUserError).toBeNull();
  });

  it('Проверка обработки ошибок (Rejected Register User)', () => {
    const errorMessage = 'Test error (rejected)';
    const rejectedAction = registerUser.rejected(
      new Error(errorMessage),
      '',
      testRegisterData
    );
    const state = userSliceReducer(initialState, rejectedAction);

    expect(state.isAuthenticated).toBe(false);
    expect(state.registerUserError).toEqual(errorMessage);
  });

  it('Проверка обработки успешной регистрации (Fulfilled Register User)', () => {
    const fulfilledAction = registerUser.fulfilled(
      testUser,
      '',
      testRegisterData
    );
    const state = userSliceReducer(initialState, fulfilledAction);

    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
    expect(state.user).toEqual(testUser);
  });
});

describe('Тесты экшенов проверки пользователя', () => {
  it('Проверка обработки начала запроса (Pending Check User)', () => {
    const pendingAction = checkUser.pending('');
    const state = userSliceReducer(initialState, pendingAction);

    expect(state.isAuthChecked).toBe(false);
    expect(state.loginUserRequest).toBe(true);
  });

  it('Проверка обработки ошибок (Rejected Check User)', () => {
    const errorMessage = 'Test error (rejected)';
    const rejectedAction = checkUser.rejected(new Error(errorMessage), '');
    const state = userSliceReducer(initialState, rejectedAction);

    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.loginUserRequest).toBe(false);
    expect(state.user).toEqual(null);
  });

  it('Проверка обработки успешного чека (Fulfilled Check User)', () => {
    const fulfilledAction = checkUser.fulfilled(testUser, '');
    const state = userSliceReducer(initialState, fulfilledAction);

    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
    expect(state.loginUserRequest).toBe(false);
    expect(state.user).toEqual(testUser);
  });
});

describe('Тесты экшенов логина пользователя', () => {
  it('Проверка обработки начала запроса (Pending Login User)', () => {
    const pendingAction = loginUser.pending('', testLoginData);
    const state = userSliceReducer(initialState, pendingAction);

    expect(state.loginUserRequest).toBe(true);
  });

  it('Проверка обработки ошибок (Rejected Login User)', () => {
    const errorMessage = 'Test error (rejected)';
    const rejectedAction = loginUser.rejected(
      new Error(errorMessage),
      '',
      testLoginData
    );
    const state = userSliceReducer(initialState, rejectedAction);

    expect(state.loginUserRequest).toBe(false);
    expect(state.isAuthChecked).toBe(true);
  });

  it('Проверка обработки успешного логина (Fulfilled Login User)', () => {
    const fulfilledAction = loginUser.fulfilled(testUser, '', testLoginData);
    const state = userSliceReducer(initialState, fulfilledAction);

    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
    expect(state.loginUserRequest).toBe(false);
    expect(state.user).toEqual(testUser);
  });
});

describe('Тесты экшенов обновления данных пользователя', () => {
  it('Проверка обработки успешного обновления (Fulfilled Update User)', () => {
    const fulfilledAction = updateUser.fulfilled(
      testUser,
      '',
      testRegisterData
    );
    const state = userSliceReducer(initialState, fulfilledAction);

    expect(state.user).toEqual(testUser);
  });
});

describe('Тесты User слайса', () => {
  it('Проверка авторизации', () => {
    let state: IUserState = {
      user: testUser,
      isAuthChecked: false,
      isAuthenticated: false,
      registerUserError: null,
      loginUserRequest: false
    };
    state = userSliceReducer(state, authChecked());
    // Проверяем
    expect(state.isAuthChecked).toBe(true);
  });

  it('Проверка логаута', () => {
    let state: IUserState = {
      user: testUser,
      isAuthChecked: true,
      isAuthenticated: true,
      registerUserError: null,
      loginUserRequest: false
    };
    state = userSliceReducer(state, userLogout());
    // Проверяем
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.user).toEqual(null);
  });
});
