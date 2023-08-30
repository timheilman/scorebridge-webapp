import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import clubDevicesReducer from "../features/clubDevices/clubDevicesSlice";
import selectedLanguageReducer from "../features/languageSelector/selectedLanguageSlice";
import subscriptionsReducer from "../features/subscriptions/subscriptionsSlice";
import superChickenModeReducer from "../features/superChickenMode/superChickenModeSlice";

export const store = configureStore({
  reducer: {
    selectedLanguage: selectedLanguageReducer,
    superChickenMode: superChickenModeReducer,
    clubDevices: clubDevicesReducer,
    subscriptions: subscriptionsReducer,
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
