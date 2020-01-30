import { combineReducers } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'

import { portfoliosReducer } from './Portfolios'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import thunk from 'redux-thunk'

//todo: добавить редукторы сюда
const rootReducer = combineReducers({
    portfolios: portfoliosReducer
});

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
});

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof rootReducer>;

export default { store, persistor }