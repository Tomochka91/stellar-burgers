import { combineReducers, configureStore } from '@reduxjs/toolkit';
import ingredientsSliceReducer from './slices/ingredientsSlice';
import burgerConstructorSliceReducer from './slices/burgerConstructorSlice';
import orderSliceReducer from './slices/orderSlice';
import feedSliceReducer from './slices/feedSlice';
import userSliceReducer from './slices/userSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  ingredients: ingredientsSliceReducer,
  burgerConstructor: burgerConstructorSliceReducer,
  order: orderSliceReducer,
  feed: feedSliceReducer,
  user: userSliceReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
