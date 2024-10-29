import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userAuthSlice from './slices/userAuthSlice';
import adminAuthSlice from './slices/adminAuthSlice';
import expertAuthSlice from './slices/expertAuthSlice';
import serviceSlice from './slices/serviceSlice';
import searchSlice from './slices/expertSearch';
import messagesSlice from './slices/messageSlice';


const userPersistConfig = { key: 'userAuth', storage, version: 1 };
const adminPersistConfig = { key: 'adminAuth', storage, version: 1 };
const expertPersistConfig = { key: 'expertAuth', storage, version: 1 };
const servicePersistConfig = { key: 'services', storage, version: 1 };
const expertSearchPersistConfig = { key: 'search', storage, version: 1 };
const messagePersistConfig = { key: 'messages', storage, version: 1 };

// Persist reducers
const userAuthPersistReducer = persistReducer(userPersistConfig, userAuthSlice.reducer);
const adminAuthPersistReducer = persistReducer(adminPersistConfig, adminAuthSlice.reducer);
const expertAuthPersistReducer = persistReducer(expertPersistConfig, expertAuthSlice.reducer);
const servicePersistReducer = persistReducer(servicePersistConfig, serviceSlice.reducer);
const expertSearchPersistReducer = persistReducer(expertSearchPersistConfig, searchSlice.reducer);
const messagePersistReducer = persistReducer(messagePersistConfig, messagesSlice.reducer);

export const store = configureStore({
  reducer: {
    user: userAuthPersistReducer,
    admin: adminAuthPersistReducer,
    expert: expertAuthPersistReducer,
    services: servicePersistReducer,
    search: expertSearchPersistReducer,
    messages: messagePersistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        serializableCheck: false,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const persistor = persistStore(store);
