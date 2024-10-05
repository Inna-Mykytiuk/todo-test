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

const initialState: TodoState = {
  columns: [],
  loading: false,
  error: null,
};

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
      // console.log("Фетчинг задач:", response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue("Не вдалося отримати задачі");
    }
  }
);

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
      console.log("Задача додана:", response.data);
      return response.data.task;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue("Не вдалося додати задачу");
    }
  }
);

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
      console.log("Задача оновлена:", response.data);
      return response.data.task;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue("Не вдалося оновити задачу");
    }
  }
);

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
      console.log("Задача видалена:", response.data);
      return taskId;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue("Не вдалося видалити задачу");
    }
  }
);

export const moveTask = createAsyncThunk(
  "todo/moveTask",
  async ({
    boardId,
    sourceColumnId,
    taskId,
    destColumnId,
  }: {
    boardId: string;
    sourceColumnId: string;
    taskId: string;
    destColumnId: string;
  }) => {
    const response = await axios.put(
      `http://localhost:5000/api/boards/${boardId}/columns/${sourceColumnId}/tasks/${taskId}/move/${destColumnId}`
    );
    return response.data;
  }
);

export const updateTaskPosition = createAsyncThunk(
  "todo/updateTaskPosition",
  async ({
    boardId,
    columnId,
    taskId,
    newIndex,
  }: {
    boardId: string;
    columnId: string;
    taskId: string;
    newIndex: number;
  }) => {
    const response = await axios.put(
      `http://localhost:5000/api/boards/${boardId}/columns/${columnId}/tasks/${taskId}/position`,
      { newIndex }
    );
    return response.data;
  }
);

export const moveTaskWithinColumn = createAsyncThunk(
  "todo/moveTaskWithinColumn",
  async ({
    boardId,
    columnId,
    taskId,
    targetIndex,
  }: {
    boardId: string;
    columnId: string;
    taskId: string;
    targetIndex: number;
  }) => {
    try {
      console.log("Move Task Within Column:", {
        boardId,
        columnId,
        taskId,
        targetIndex,
      });

      const response = await axios.put(
        `http://localhost:5000/api/boards/${boardId}/${columnId}/tasks/${taskId}/move/${targetIndex}`
      );

      console.log("Response Data:", response.data); // Логуємо відповідь від сервера

      return response.data; // Повертаємо дані, які будуть використані у редюсері
    } catch (error) {
      console.error("Error moving task within column:", error); // Логування помилки
      throw error; // Перевірка на помилку
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
          column.tasks.push(action.payload);
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
            column.tasks[taskIndex] = action.payload;
          }
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const column = state.columns.find(
          (col) => col.id === action.meta.arg.columnId
        );
        if (column) {
          column.tasks = column.tasks.filter(
            (task) => task.id !== action.payload
          );
        }
      })
      .addCase(moveTask.fulfilled, (state, action) => {
        const { sourceColumnId, destColumnId, task } = action.payload;

        const sourceColumn = state.columns.find(
          (col) => col.id === sourceColumnId
        );
        const destColumn = state.columns.find((col) => col.id === destColumnId);

        if (sourceColumn && destColumn) {
          sourceColumn.tasks = sourceColumn.tasks.filter(
            (t) => t.id !== task.id
          );
          destColumn.tasks.push(task);
        }
      })
      .addCase(moveTaskWithinColumn.fulfilled, (state, action) => {
        const { columnId, task } = action.payload;
        const column = state.columns.find((col) => col.id === columnId);

        if (column) {
          const taskIndex = column.tasks.findIndex((t) => t.id === task.id);
          if (taskIndex !== -1) {
            // Вилучаємо задачу з початкової позиції
            column.tasks.splice(taskIndex, 1);
            // Додаємо задачу на нову позицію
            column.tasks.splice(action.payload.targetIndex, 0, task);
          }
        }
      })
      .addCase(updateTaskPosition.fulfilled, (state, action) => {
        const { columnId, taskId } = action.payload;
        const column = state.columns.find((col) => col.id === columnId);

        if (column) {
          const taskIndex = column.tasks.findIndex(
            (task) => task.id === taskId
          );
          if (taskIndex !== -1) {
            const [task] = column.tasks.splice(taskIndex, 1);
            column.tasks.splice(action.payload.newIndex, 0, task);
          }
        }
      });
  },
});

// Selectors
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
