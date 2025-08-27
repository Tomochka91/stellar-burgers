import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TBun,
  TConstructorIngredient,
  TIngredient,
  TOrder
} from '@utils-types';
import { v4 as uuidv4 } from 'uuid';
import { orderBurger } from './orderSlice';

interface IConstructorItems {
  bun: TBun | null;
  ingredients: TConstructorIngredient[];
}

export interface IBurgerConstructorState {
  constructorItems: IConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

export const initialState: IBurgerConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload as TBun;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = uuidv4();
        return { payload: { ...ingredient, id } as TConstructorIngredient };
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
      state.orderRequest = false;
      state.orderModalData = null;
    }
  },
  selectors: {
    selectConstructorItems: (sliceState) => sliceState.constructorItems,
    selectOrderRequest: (sliceState) => sliceState.orderRequest,
    selectOrderModalData: (sliceState) => sliceState.orderModalData
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      });
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
