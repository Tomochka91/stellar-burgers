import orderSliceReducer, {
  getOrderByNumber,
  getUserOrders,
  IOrderState,
  clearOrderData,
  initialState
} from '../slices/orderSlice';
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

describe('Тесты запроса заказов по номеру', () => {
  it('Проверка обработки начала запроса (Pending by Number)', () => {
    const pendingAction = getOrderByNumber.pending('', 1);
    const state = orderSliceReducer(initialState, pendingAction);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Проверка обработки ошибок (Rejected by Number)', () => {
    const errorMessage = 'Test error (rejected)';
    const rejectedAction = getOrderByNumber.rejected(
      new Error(errorMessage),
      '',
      1
    );
    const state = orderSliceReducer(initialState, rejectedAction);

    expect(state.loading).toBe(false);
    expect(state.error).toEqual(errorMessage);
  });

  it('Проверка обработки данных заказа (Fulfilled by Number)', () => {
    const fulfilledAction = getOrderByNumber.fulfilled(testOrder, '', 1);
    const state = orderSliceReducer(initialState, fulfilledAction);

    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.orderData).toEqual(testOrder);
  });
});

describe('Тесты запроса заказов для пользователя', () => {
  it('Проверка обработки начала запроса (Pending by User)', () => {
    const pendingAction = getUserOrders.pending('');
    const state = orderSliceReducer(initialState, pendingAction);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Проверка обработки ошибок (Rejected by User)', () => {
    const errorMessage = 'Test error (rejected)';
    const rejectedAction = getUserOrders.rejected(new Error(errorMessage), '');
    const state = orderSliceReducer(initialState, rejectedAction);

    expect(state.loading).toBe(false);
    expect(state.error).toEqual(errorMessage);
  });

  it('Проверка обработки данных заказа (Fulfilled by User)', () => {
    const fulfilledAction = getUserOrders.fulfilled([testOrder], '');
    const state = orderSliceReducer(initialState, fulfilledAction);

    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.userOrdersData).toEqual([testOrder]);
  });
});

describe('Тесты слайса заказов', () => {
  it('Проверка очистки заказа', () => {
    // Добавляем данные заказа в стэйт
    let state: IOrderState = {
      orderData: testOrder,
      userOrdersData: null,
      loading: false,
      error: null
    };
    // Очищаем
    state = orderSliceReducer(state, clearOrderData());
    // Проверяем очистку
    expect(state.orderData).toBeNull();
  });
});
