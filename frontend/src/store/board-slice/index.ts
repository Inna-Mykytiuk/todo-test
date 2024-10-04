import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Task {
  id: string;
  name: string;
}

interface Column {
  title: string;
  tasks: Task[];
}

interface Board {
  id: string;
  name: string;
  columns: Column[];
}

interface BoardsState {
  boards: Board[];
}

const initialState: BoardsState = {
  boards: [],
};

const boardSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    createBoard: (state, action: PayloadAction<string>) => {
      const newBoard: Board = {
        id: Date.now().toString(),
        name: action.payload,
        columns: [
          { title: "To Do", tasks: [] },
          { title: "In Progress", tasks: [] },
          { title: "Done", tasks: [] },
        ],
      };
      state.boards.push(newBoard);
    },
  },
});

export const { createBoard } = boardSlice.actions;
export default boardSlice.reducer;
