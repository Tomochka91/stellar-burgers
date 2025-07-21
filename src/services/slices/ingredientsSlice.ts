import { getIngredientsApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TIngredient, TTabMode } from '@utils-types';

interface IIngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IIngredientsState = {
  ingredients: [],
  isLoading: true,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async () => await getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (sliceState) => sliceState.ingredients,
    selectIngredientById: (sliceState) => (id: string) =>
      sliceState.ingredients.find((item) => item._id === id),
    selectIsLoading: (sliceState) => sliceState.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch ingredients';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      });
  }
});

// Мемоизированный селектор
export const selectIngredientsByType = createSelector(
  [
    (state: IIngredientsState) => state.ingredients,
    (_state: IIngredientsState, type: TTabMode) => type
  ],
  (ingredients, type) => ingredients.filter((item) => item.type === type)
);

export const { selectIngredients, selectIngredientById, selectIsLoading } =
  ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
