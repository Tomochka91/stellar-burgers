import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TBun,
  TConstructorIngredient,
  TIngredient,
  TOrder
} from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

interface IConstructorItems {
  bun: TBun | null;
  ingredients: TConstructorIngredient[];
}

interface IBurgerConstructorState {
  constructorItems: IConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IBurgerConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  isLoading: true,
  error: null
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient(state, action: PayloadAction<TIngredient>) {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload as TBun;
      } else {
        const ingredientsWithId: TConstructorIngredient = {
          ...action.payload,
          id: uuidv4()
        };
        state.constructorItems.ingredients.push(ingredientsWithId);
      }
    },
    moveIngredient(
      state,
      action: PayloadAction<{ id: string; direction: 'up' | 'down' }>
    ) {
      const { ingredients } = state.constructorItems;
      const { id, direction } = action.payload;
      const currentIndex = ingredients.findIndex((item) => item.id === id);

      if (currentIndex === -1) return;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= ingredients.length) return;

      const newIngredients = [...ingredients];
      const [movedItem] = newIngredients.splice(currentIndex, 1);
      newIngredients.splice(newIndex, 0, movedItem);

      state.constructorItems.ingredients = newIngredients;
    },
    deleteIngredient(state, action: PayloadAction<{ id: string }>) {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload.id
        );
    },
    clearBurgerConstructor(state) {
      state.constructorItems = { bun: null, ingredients: [] };
    }
  },
  selectors: {
    selectConstructorItems: (sliceState) => sliceState.constructorItems,
    selectOrderRequest: (sliceState) => sliceState.orderRequest,
    selectOrderModalData: (sliceState) => sliceState.orderModalData
  }
});

export const {
  addIngredient,
  moveIngredient,
  deleteIngredient,
  clearBurgerConstructor
} = burgerConstructorSlice.actions;

export const {
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData
} = burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
