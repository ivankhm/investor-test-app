import { combineReducers } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import { portfoliosReducer } from './Portfolios'

//todo: добавить редукторы сюда
const rootReducer = combineReducers({
    portfoliosReducer
    
});

const store = configureStore({
    reducer: rootReducer
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof rootReducer>;

export default store;