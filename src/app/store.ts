import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import clubDevicesReducer from "../features/clubDevices/clubDevicesSlice";
import idTokenReducer from "../features/header/idTokenSlice";
import selectedLanguageReducer from "../features/languageSelector/selectedLanguageSlice";
import subscriptionsReducer from "../features/subscriptions/subscriptionsSlice";
import subscriptionStatesReducer from "../scorebridge-ts-submodule/react/subscriptionStatesSlice";

export const store = configureStore({
  reducer: {
    selectedLanguage: selectedLanguageReducer,
    clubDevices: clubDevicesReducer,
    subscriptions: subscriptionsReducer,
    subscriptionStates: subscriptionStatesReducer,
    idToken: idTokenReducer,
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
