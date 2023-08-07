import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import counterReducer from "../features/counter/counterSlice";
import projectListReducer from "../features/projects/projectListSlice";
import selectedLanguageReducer from "../features/selectedLanguage/selectedLanguageSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    projectList: projectListReducer,
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
