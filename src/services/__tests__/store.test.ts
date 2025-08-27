import store from '../store';

describe('Корневой редюсер', () => {
  it('Проверка Initial State', () => {
    const state = store.getState();

    // Все наши слайсы
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('user');
  });

  it('Проверка на Unknown Action', () => {
    const oldState = store.getState();

    store.dispatch({ type: 'UNKNOWN_ACTION' });
    const newState = store.getState();

    expect(newState).toEqual(oldState);
  });
});
