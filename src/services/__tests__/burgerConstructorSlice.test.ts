import burgerConstructorSliceReducer, {
  addIngredient,
  moveIngredient,
  deleteIngredient,
  clearBurgerConstructor,
  IBurgerConstructorState,
  initialState
} from '../slices/burgerConstructorSlice';
import { TIngredient } from '../../utils/types';

const bunIngredient1: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const bunIngredient2: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093d',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
};

const mainIngredient1: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

const mainIngredient2: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093e',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
};

describe('Тесты конструктора', () => {
  it('Проверка добавления ингредиентов', () => {
    // Пытаемся добавить булку
    let state = burgerConstructorSliceReducer(
      initialState,
      addIngredient(bunIngredient1)
    );
    // Проверяем добавление булки
    expect(state.constructorItems.bun).toEqual({
      ...bunIngredient1,
      id: expect.any(String)
    });
    // Проверяем, что в основных ингредиентах пусто
    expect(state.constructorItems.ingredients).toEqual([]);

    // ##########
    // Пытаемся добавить основной ингредиент
    state = burgerConstructorSliceReducer(
      state,
      addIngredient(mainIngredient1)
    );
    // Проверяем
    expect(state.constructorItems.ingredients).toEqual([
      {
        ...mainIngredient1,
        id: expect.any(String)
      }
    ]);
  });

  it('Проверка замены булки', () => {
    // Пытаемся добавить первую булку
    let state = burgerConstructorSliceReducer(
      initialState,
      addIngredient(bunIngredient1)
    );
    // Сохраняем булку, которую добавили
    const firstBun = state.constructorItems.bun;

    // Пытаемся заменить булку
    state = burgerConstructorSliceReducer(state, addIngredient(bunIngredient2));
    // Проверяем, что булка заменилась
    expect(state.constructorItems.bun).toEqual({
      ...bunIngredient2,
      id: expect.any(String)
    });
    expect(state.constructorItems.bun).not.toEqual({
      ...firstBun,
      id: expect.any(String)
    });
  });

  it('Проверка удаления ингредиента', () => {
    // Пытаемся добавить основной ингредиент
    let state = burgerConstructorSliceReducer(
      initialState,
      addIngredient(mainIngredient1)
    );
    const ingredientId = state.constructorItems.ingredients[0].id;
    // Удаляем ингредиент
    state = burgerConstructorSliceReducer(
      state,
      deleteIngredient({ id: ingredientId })
    );
    // Проверяем, что в основных ингредиентах пусто
    expect(state.constructorItems.ingredients).toEqual([]);
  });

  it('Проверка перемещения ингредиента', () => {
    // Пытаемся добавить основной ингредиент 1
    let state = burgerConstructorSliceReducer(
      initialState,
      addIngredient(mainIngredient1)
    );
    // Пытаемся добавить основной ингредиент 2
    state = burgerConstructorSliceReducer(
      state,
      addIngredient(mainIngredient2)
    );

    const ingredientId1 = state.constructorItems.ingredients[0].id;
    // const ingredientId2 = state.constructorItems.ingredients[1].id;

    // Меняем ингредиенты местами
    state = burgerConstructorSliceReducer(
      state,
      moveIngredient({ id: ingredientId1, direction: 'down' })
    );

    // Проверяем, что ингредиенты поменялись местами
    expect(state.constructorItems.ingredients[0]).toEqual({
      ...mainIngredient2,
      id: expect.any(String)
    });
    expect(state.constructorItems.ingredients[1]).toEqual({
      ...mainIngredient1,
      id: expect.any(String)
    });
  });

  it('Проверка очистки конструктора', () => {
    // Пытаемся добавить булку
    let state = burgerConstructorSliceReducer(
      initialState,
      addIngredient(bunIngredient1)
    );
    // Проверяем добавление булки
    expect(state.constructorItems.bun).toEqual({
      ...bunIngredient1,
      id: expect.any(String)
    });

    // Пытаемся добавить основной ингредиент
    state = burgerConstructorSliceReducer(
      state,
      addIngredient(mainIngredient1)
    );
    // Проверяем
    expect(state.constructorItems.ingredients).toEqual([
      {
        ...mainIngredient1,
        id: expect.any(String)
      }
    ]);

    // Очищаем конструктор
    state = burgerConstructorSliceReducer(state, clearBurgerConstructor());
    // Проверяем удаление булки
    expect(state.constructorItems.bun).toBeNull();
    // Проверяем, что в основных ингредиентах пусто
    expect(state.constructorItems.ingredients).toEqual([]);
  });
});
