import { combineReducers } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'

import { portfoliosReducer } from './Portfolios'

import { persistStore, persistReducer, createMigrate } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import thunk from 'redux-thunk'
import { exchangeRatesReducer } from './ExchangeRates'
import { migrations, STORE_VERSION } from './migrations'

//todo: добавить редукторы сюда
const rootReducer = combineReducers({
    portfolios: portfoliosReducer,
    exchangeRates: exchangeRatesReducer
});

const persistConfig = {
    key: 'root',
    version: STORE_VERSION,
    storage,
    migrate: createMigrate(migrations, { debug: false }),
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