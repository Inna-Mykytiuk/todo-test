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

// Async Thunks
export const fetchBoards = createAsyncThunk<Board[]>(
  "boards/fetchBoards",
  async () => {
    const response = await axios.get("http://localhost:5000/api/boards");
    console.log("Fetched boards:", response.data); // Log fetched boards
    return response.data;
  }
);

export const createBoard = createAsyncThunk<Board, string>(
  "boards/createBoard",
  async (name) => {
    const response = await axios.post("http://localhost:5000/api/boards", {
      name,
    });
    console.log("Created board:", response.data); // Log created board
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
  console.log("Updated board:", response.data); // Log updated board
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
      console.log(`Deleted board with ID: ${id}`); // Log deleted board ID
      return id; // Return deleted board ID
    } catch (error) {
      console.error("Error deleting board:", error);
      throw error; // Propagate error
    }
  }
);

// Create slice
const boardSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
      localStorage.setItem("boards", JSON.stringify(action.payload)); // Save to local storage
    },
    clearBoardName: (state) => {
      state.error = null; // Clear error
    },
    updateLocalBoard: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      const { id, name } = action.payload;
      const index = state.boards.findIndex((b) => b._id === id);
      if (index !== -1) {
        state.boards[index].name = name; // Update board name
      }
    },
    deleteLocalBoard: (state, action: PayloadAction<string>) => {
      state.boards = state.boards.filter(
        (board) => board._id !== action.payload // Delete local board
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true; // Set loading state
        state.error = null; // Reset error
      })
      .addCase(
        fetchBoards.fulfilled,
        (state, action: PayloadAction<Board[]>) => {
          state.loading = false; // Clear loading state
          state.boards = action.payload; // Update boards state
          localStorage.setItem("boards", JSON.stringify(action.payload)); // Save boards to local storage
        }
      )
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false; // Clear loading state
        state.error = action.error.message || "Помилка завантаження даних"; // Set error
      })
      .addCase(createBoard.fulfilled, (state, action: PayloadAction<Board>) => {
        state.boards.push(action.payload); // Add new board
        localStorage.setItem("boards", JSON.stringify(state.boards)); // Update local storage
      })
      .addCase(updateBoard.fulfilled, (state, action: PayloadAction<Board>) => {
        const updatedBoard = action.payload;
        const index = state.boards.findIndex((b) => b._id === updatedBoard._id);
        if (index !== -1) {
          state.boards[index] = updatedBoard; // Update board
          localStorage.setItem("boards", JSON.stringify(state.boards)); // Update local storage
        }
      })
      .addCase(
        deleteBoard.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.boards = state.boards.filter(
            (board) => board._id !== action.payload // Remove deleted board
          );
          localStorage.setItem("boards", JSON.stringify(state.boards)); // Update local storage
        }
      );
  },
});

// Load boards from local storage
export const loadBoardsFromLocalStorage = (): Board[] => {
  const boardsString = localStorage.getItem("boards");
  return boardsString ? JSON.parse(boardsString) : [];
};

// Export actions and reducer
export const { setBoards, clearBoardName, updateLocalBoard, deleteLocalBoard } =
  boardSlice.actions;
export default boardSlice.reducer;
