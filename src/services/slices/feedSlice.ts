import { getFeedsApi } from '../../utils/burger-api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export interface IOrdersState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: IOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: true,
  error: null
};

export const fetchFeeds = createAsyncThunk(
  'feeds/getFeedsApi',
  async () => await getFeedsApi()
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    selectOrders: (sliceState) => sliceState.orders,
    selectIsLoading: (sliceState) => sliceState.isLoading,
    selectError: (sliceState) => sliceState.error,
    selectTotalFeedData: createSelector(
      [(state) => state.total, (state) => state.totalToday],
      (total, totalToday) => ({
        total,
        totalToday
      })
    )
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка при получении данных ленты';
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  }
});

export const { selectOrders, selectTotalFeedData, selectIsLoading } =
  feedSlice.selectors;
export default feedSlice.reducer;
