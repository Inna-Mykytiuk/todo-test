import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";
import { createSelector } from "reselect";

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
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
}

const initialState: TodoState = {
  columns: [],
  loading: {},
  error: {},
};

export const fetchTasks = createAsyncThunk(
  "todo/fetchTasks",
  async (
    { boardId, columnId }: { boardId: string; columnId: string },
    thunkAPI
  ) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/boards/${boardId}/columns/${columnId}/tasks`
      );
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
        `${import.meta.env.VITE_API_URL}/api/boards/${boardId}/columns/${columnId}/tasks`,
        { title, description }
      );
      // console.log("Задача додана:", response.data);
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
        `${import.meta.env.VITE_API_URL}/api/boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
        { title, description }
      );
      // console.log("Задача оновлена:", response.data);
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
        `${import.meta.env.VITE_API_URL}/api/boards/${boardId}/columns/${columnId}/tasks/${taskId}`
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
      `${import.meta.env.VITE_API_URL}/api/boards/${boardId}/columns/${sourceColumnId}/tasks/${taskId}/move/${destColumnId}`
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
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/boards/${boardId}/${columnId}/tasks/${taskId}/move/${targetIndex}`
    );
    return response.data;
  }
);

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state, action) => {
        state.loading[action.meta.arg.columnId] = true;
        state.error[action.meta.arg.columnId] = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading[action.meta.arg.columnId] = false;
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
        state.loading[action.meta.arg.columnId] = false;
        state.error[action.meta.arg.columnId] = action.payload as string;
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
            column.tasks.splice(taskIndex, 1);
            column.tasks.splice(action.payload.targetIndex, 0, task);
          }
        }
      });
  },
});

export const selectColumns = (state: { todo: TodoState }) => state.todo.columns;
export const selectLoading = (state: { todo: TodoState }) => state.todo.loading;
export const selectError = (state: { todo: TodoState }) => state.todo.error;

export const selectColumnTasks = createSelector(
  (state: { todos: TodoState }, columnId: string) =>
    state.todos.columns.find((col) => col.id === columnId),
  (column) => column?.tasks || []
);

export default todoSlice.reducer;
