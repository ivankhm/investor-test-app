import { combineReducers } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'

//todo: добавить редукторы сюда
const rootReducer = combineReducers({});


const store = configureStore({
    reducer: rootReducer
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof rootReducer>;