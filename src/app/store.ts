import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import selectedLanguageReducer from "../features/./languageSelector/selectedLanguageSlice";

export const store = configureStore({
  reducer: {
    selectedLanguage: selectedLanguageReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
