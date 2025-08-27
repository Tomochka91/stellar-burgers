import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { RootState } from '../store';
import {
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '../../utils/burger-api';
import { TOrder } from '@utils-types';

export interface IOrderState {
  orderData: TOrder | null;
  userOrdersData: TOrder[] | null;
  loading: boolean;
  error: string | null;
}

export const initialState: IOrderState = {
  orderData: null,
  userOrdersData: null,
  loading: false,
  error: null
};

export const orderBurger = createAsyncThunk(
  'order/orderBurger',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { bun, ingredients } = state.burgerConstructor.constructorItems;

    if (!bun) {
      throw new Error('Не выбрана булка');
    }

    if (ingredients.length === 0) {
      throw new Error('Добавьте ингредиенты');
    }

    const ingredientsById = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    const response = await orderBurgerApi(ingredientsById);
    return response.order;
  }
);

export const getOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/getOrderByNumber',
  async (number: number) => {
    const { orders } = await getOrderByNumberApi(number);
    const order = orders[0];
    return order;
  }
);

export const getUserOrders = createAsyncThunk<TOrder[]>(
  'order/getUserOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderData(state) {
      state.orderData = null;
    }
  },
  selectors: {
    selectOrderData: (sliceState) => sliceState.orderData,
    selectUserOrdersData: createSelector(
      [(state: IOrderState) => state.userOrdersData],
      (userOrderdata) => userOrderdata ?? []
    )
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Ошибка при получении данных заказа';
      })
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrdersData = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ||
          'Ошибка при получении данных заказов пользователя';
      });
  }
});

export const { clearOrderData } = orderSlice.actions;

export const { selectOrderData, selectUserOrdersData } = orderSlice.selectors;

export default orderSlice.reducer;
