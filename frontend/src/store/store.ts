import { configureStore } from "@reduxjs/toolkit";

import boardReducer from "./board-slice";
import todosReducer from "./todo-slice";

const store = configureStore({
  reducer: {
    boards: boardReducer,
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
