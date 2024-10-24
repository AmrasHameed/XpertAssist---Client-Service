import { configureStore } from '@reduxjs/toolkit';
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
import serviceRequest from './slices/serviceRequestSlice'

const userPersistConfig = { key: 'userAuth', storage, version: 1 };
const adminPersistConfig = { key: 'adminAuth', storage, version: 1 };
const expertPersistConfig = { key: 'expertAuth', storage, version: 1 };
const servicePersistConfig = { key: 'services', storage, version: 1 };
const expertSearchPersistConfig = { key: 'search', storage, version: 1 };
const serviceRequestPersistConfig = { key: 'serviceRequest', storage, version: 1 };


const userAuthPersistReducer = persistReducer(
  userPersistConfig,
  userAuthSlice.reducer
);
const adminAuthPersistReducer = persistReducer(
  adminPersistConfig,
  adminAuthSlice.reducer
);
const expertAuthPersistReducer = persistReducer(
  expertPersistConfig,
  expertAuthSlice.reducer
);
const servicePersistReducer = persistReducer(
  servicePersistConfig,
  serviceSlice.reducer
);
const expertSearchPersistReducer = persistReducer(
  expertSearchPersistConfig,
  searchSlice.reducer
);
const serviceRequestPersistReducer = persistReducer(
  serviceRequestPersistConfig,
  serviceRequest.reducer
);


export const store = configureStore({
  reducer: {
    user: userAuthPersistReducer,
    admin: adminAuthPersistReducer,
    expert: expertAuthPersistReducer,
    services: servicePersistReducer,
    search: expertSearchPersistReducer,
    serviceRequest: serviceRequestPersistReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
    return middleware;
  },
});

export type RootState = ReturnType<typeof store.getState>;

export const persistor = persistStore(store);
