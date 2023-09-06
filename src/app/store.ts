import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import clubDevicesReducer from "../features/clubDevices/clubDevicesSlice";
import selectedLanguageReducer from "../features/languageSelector/selectedLanguageSlice";
import subscriptionsReducer from "../features/subscriptions/subscriptionsSlice";
import subscriptionStatesReducerKv from "../scorebridge-ts-submodule/subscriptionStatesSlice";

export const store = configureStore({
  reducer: {
    selectedLanguage: selectedLanguageReducer,
    clubDevices: clubDevicesReducer,
    subscriptions: subscriptionsReducer,
    ...subscriptionStatesReducerKv,
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
