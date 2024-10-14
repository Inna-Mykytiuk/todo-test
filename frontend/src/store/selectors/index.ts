import { createSelector } from "reselect";

import { TodoState } from "../todo-slice";

export const selectColumnTasks = createSelector(
  (state: { todos: TodoState }, columnId: string) =>
    state.todos.columns.find((col) => col.id === columnId),
  (column) => column?.tasks || []
);
