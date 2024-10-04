import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Task {
  _id: string;
  title: string;
  description: string;
}

interface Column {
  _id: string;
  title: string;
  tasks: Task[];
}

export interface Board {
  _id: string;
  id?: string;
  name: string;
  columns: Column[];
}

interface BoardsState {
  boards: Board[];
  loading: boolean;
  error: string | null;
}

const initialState: BoardsState = {
  boards: [],
  loading: false,
  error: null,
};

// Асинхронні екшени
export const fetchBoards = createAsyncThunk<Board[]>(
  "boards/fetchBoards",
  async () => {
    const response = await axios.get("http://localhost:5000/api/boards");
    console.log("Fetched boards:", response.data); // Додайте це
    return response.data;
  }
);

export const createBoard = createAsyncThunk<Board, string>(
  "boards/createBoard",
  async (name) => {
    const response = await axios.post("http://localhost:5000/api/boards", {
      name,
    });
    console.log(response.data);
    return response.data;
  }
);

export const updateBoard = createAsyncThunk<
  Board,
  { id: string; name: string }
>("boards/updateBoard", async ({ id, name }) => {
  const response = await axios.put(`http://localhost:5000/api/boards/${id}`, {
    name,
  });
  return response.data;
});

export const deleteBoard = createAsyncThunk<string, string>(
  "boards/deleteBoard",
  async (id) => {
    if (!id) {
      throw new Error("Board ID is required");
    }

    try {
      await axios.delete(`http://localhost:5000/api/boards/${id}`);
      return id; // Повертаємо ID видаленого борду
    } catch (error) {
      console.error("Error deleting board:", error);
      throw error; // Не забувайте прокидати помилку далі
    }
  }
);

// Створення slice
const boardSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
    },
    clearBoardName: (state) => {
      state.error = null;
    },
    updateLocalBoard: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      const { id, name } = action.payload;
      const index = state.boards.findIndex((b) => b._id === id);
      if (index !== -1) {
        state.boards[index].name = name;
      }
    },
    deleteLocalBoard: (state, action: PayloadAction<string>) => {
      state.boards = state.boards.filter(
        (board) => board._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBoards.fulfilled,
        (state, action: PayloadAction<Board[]>) => {
          state.loading = false;
          state.boards = action.payload;
        }
      )
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Помилка завантаження даних";
      })
      .addCase(createBoard.fulfilled, (state, action: PayloadAction<Board>) => {
        state.boards.push(action.payload);
      })
      .addCase(updateBoard.fulfilled, (state, action: PayloadAction<Board>) => {
        const updatedBoard = action.payload;
        const index = state.boards.findIndex((b) => b._id === updatedBoard._id);
        if (index !== -1) {
          state.boards[index] = updatedBoard;
        }
      })
      .addCase(
        deleteBoard.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.boards = state.boards.filter(
            (board) => board._id !== action.payload
          );
        }
      );
  },
});

export const { setBoards, clearBoardName, updateLocalBoard, deleteLocalBoard } =
  boardSlice.actions;
export default boardSlice.reducer;
