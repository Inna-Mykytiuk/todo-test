import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Todo {
  _id: string;
  title: string;
  description: string;
}

interface TodosState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: TodosState = {
  todos: [],
  loading: false,
  error: null,
};

const BASE_URL = "http://localhost:5000/api/todos";

export const fetchTodos = createAsyncThunk<Todo[]>(
  "todos/fetchTodos",
  async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
  }
);

export const createTodo = createAsyncThunk<
  Todo,
  { title: string; description: string; columnId: string } // Додаємо columnId
>("todos/createTodo", async (todo) => {
  const response = await axios.post(BASE_URL, todo);
  return response.data;
});

export const updateTodo = createAsyncThunk<
  Todo,
  { id: string; todo: { title: string; description: string } }
>("todos/updateTodo", async ({ id, todo }) => {
  const response = await axios.put(`${BASE_URL}/${id}`, todo);
  return response.data;
});

export const deleteTodo = createAsyncThunk<string, string>(
  "todos/deleteTodo",
  async (id) => {
    await axios.delete(`${BASE_URL}/${id}`);
    return id;
  }
);

// Створення slice
const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateLocalTodo: (
      state,
      action: PayloadAction<{ id: string; title: string; description: string }>
    ) => {
      const { id, title, description } = action.payload;
      const index = state.todos.findIndex((todo) => todo._id === id);
      if (index !== -1) {
        state.todos[index] = { ...state.todos[index], title, description };
      }
    },
    deleteLocalTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Помилка завантаження даних";
      })
      .addCase(createTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.todos.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        const updatedTodo = action.payload;
        const index = state.todos.findIndex(
          (todo) => todo._id === updatedTodo._id
        );
        if (index !== -1) {
          state.todos[index] = updatedTodo;
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<string>) => {
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
      });
  },
});

export const { setTodos, clearError, updateLocalTodo, deleteLocalTodo } =
  todoSlice.actions;

export default todoSlice.reducer;
