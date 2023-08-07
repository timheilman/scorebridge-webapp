import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";

export interface SelectedLanguageState {
  value: string;
}

const initialState: SelectedLanguageState = {
  value: "en",
};

export const selectedLanguageSlice = createSlice({
  name: "selectedLanguage",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    //     incrementByAmount: (state, action: PayloadAction<number>) => {
    //       state.value += action.payload;
    //     },
    setLanguage: (state, action: PayloadAction<string>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = action.payload;
    },
  },
});

export const { setLanguage } = selectedLanguageSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export const selectLanguage = (state: RootState) =>
  state.selectedLanguage.value;

export default selectedLanguageSlice.reducer;
