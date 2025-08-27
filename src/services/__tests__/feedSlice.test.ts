import feedSliceReducer, {
  fetchFeeds,
  IOrdersState
} from '../slices/feedSlice';
import { TOrder } from '../../utils/types';

const testOrder: TOrder = {
  _id: '1',
  status: 'done',
  name: 'test',
  createdAt: '',
  updatedAt: '',
  number: 1,
  ingredients: []
};

const fulfilledOrderResponse = {
  success: true,
  orders: [testOrder],
  total: 1,
  totalToday: 2
};

describe('Тесты ленты заказов', () => {
  const initialState: IOrdersState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: true,
    error: null
  };

  it('Проверка обработки начала запроса (Pending)', () => {
    const pendingAction = fetchFeeds.pending('');
    const state = feedSliceReducer(initialState, pendingAction);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Проверка обработки ошибок (Rejected)', () => {
    const errorMessage = 'Test error (rejected)';
    const rejectedAction = fetchFeeds.rejected(
      new Error(errorMessage),
      '',
      undefined
    );
    const state = feedSliceReducer(initialState, rejectedAction);

    expect(state.isLoading).toBe(false);
    expect(state.error).toEqual(errorMessage);
  });

  it('Проверка обработки ленты заказов (Fulfilled)', () => {
    const fulfilledAction = fetchFeeds.fulfilled(
      fulfilledOrderResponse,
      '',
      undefined
    );
    const state = feedSliceReducer(initialState, fulfilledAction);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.orders).toEqual(fulfilledOrderResponse.orders);
    expect(state.total).toBe(fulfilledOrderResponse.total);
    expect(state.totalToday).toBe(fulfilledOrderResponse.totalToday);
  });
});
