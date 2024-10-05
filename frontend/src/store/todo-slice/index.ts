import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from "reselect"; // Імпорт reselect
import axios from "axios";

export interface Task {
  id: string;
  title: string;
  description: string;
}

export interface Column {
  id: string;
  tasks: Task[];
}

interface TodoState {
  columns: Column[];
  loading: boolean;
  error: string | null;
}

// Ініціальний стан
const initialState: TodoState = {
  columns: [],
  loading: false,
  error: null,
};

// Асинхронна функція для отримання задач
export const fetchTasks = createAsyncThunk(
  "todo/fetchTasks",
  async (
    { boardId, columnId }: { boardId: string; columnId: string },
    thunkAPI
  ) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/boards/${boardId}/columns/${columnId}/tasks`
      );
      console.log("Фетчинг задач:", response.data); // Консоль лог для перевірки
      return response.data;
    } catch (error) {
      console.error(error); // Консоль лог помилки
      return thunkAPI.rejectWithValue("Не вдалося отримати задачі");
    }
  }
);

// Асинхронна функція для додавання задачі
export const addTask = createAsyncThunk(
  "todo/addTask",
  async (
    {
      boardId,
      columnId,
      title,
      description,
    }: {
      boardId: string;
      columnId: string;
      title: string;
      description: string;
    },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/boards/${boardId}/columns/${columnId}/tasks`,
        { title, description }
      );
      console.log("Задача додана:", response.data); // Консоль лог для перевірки
      return response.data.task; // Повертаємо нову задачу
    } catch (error) {
      console.error(error); // Консоль лог помилки
      return thunkAPI.rejectWithValue("Не вдалося додати задачу");
    }
  }
);

// Асинхронна функція для оновлення задачі
export const updateTask = createAsyncThunk(
  "todo/updateTask",
  async (
    {
      boardId,
      columnId,
      taskId,
      title,
      description,
    }: {
      boardId: string;
      columnId: string;
      taskId: string;
      title?: string;
      description?: string;
    },
    thunkAPI
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
        { title, description }
      );
      console.log("Задача оновлена:", response.data); // Консоль лог для перевірки
      return response.data.task; // Повертаємо оновлену задачу
    } catch (error) {
      console.error(error); // Консоль лог помилки
      return thunkAPI.rejectWithValue("Не вдалося оновити задачу");
    }
  }
);

// Асинхронна функція для видалення задачі
export const deleteTask = createAsyncThunk(
  "todo/deleteTask",
  async (
    {
      boardId,
      columnId,
      taskId,
    }: { boardId: string; columnId: string; taskId: string },
    thunkAPI
  ) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/boards/${boardId}/columns/${columnId}/tasks/${taskId}`
      );
      console.log("Задача видалена:", response.data); // Консоль лог для перевірки
      return taskId; // Повертаємо ID видаленої задачі
    } catch (error) {
      console.error(error); // Консоль лог помилки
      return thunkAPI.rejectWithValue("Не вдалося видалити задачу");
    }
  }
);

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        const column = state.columns.find(
          (col) => col.id === action.meta.arg.columnId
        );
        if (column) {
          column.tasks = action.payload;
        } else {
          state.columns.push({
            id: action.meta.arg.columnId,
            tasks: action.payload,
          });
        }
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const column = state.columns.find(
          (col) => col.id === action.meta.arg.columnId
        );
        if (column) {
          column.tasks.push(action.payload); // Додаємо нову задачу
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const column = state.columns.find(
          (col) => col.id === action.meta.arg.columnId
        );
        if (column) {
          const taskIndex = column.tasks.findIndex(
            (task) => task.id === action.meta.arg.taskId
          );
          if (taskIndex !== -1) {
            column.tasks[taskIndex] = action.payload; // Оновлюємо задачу
          }
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const column = state.columns.find(
          (col) => col.id === action.meta.arg.columnId
        );
        if (column) {
          column.tasks = column.tasks.filter(
            (task) => task.id !== action.payload // Видаляємо задачу за ID
          );
        }
      });
  },
});

// Селектори
export const selectColumns = (state: { todo: TodoState }) => state.todo.columns;
export const selectLoading = (state: { todo: TodoState }) => state.todo.loading;
export const selectError = (state: { todo: TodoState }) => state.todo.error;

// Мемоїзований селектор для отримання задач з конкретної колонки
export const selectColumnTasks = createSelector(
  (state: { todos: TodoState }, columnId: string) =>
    state.todos.columns.find((col) => col.id === columnId),
  (column) => column?.tasks || []
);

export default todoSlice.reducer;
