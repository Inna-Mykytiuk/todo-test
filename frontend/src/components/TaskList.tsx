// TaskList.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../store/todo-slice";
import { selectColumnTasks } from "../store/todo-slice";

import type { RootState, AppDispatch } from "../store/store";
import type { Task } from "../store/todo-slice";

interface TaskListProps {
  boardId: string;
  columnId: string;
}

const TaskList: React.FC<TaskListProps> = ({ boardId, columnId }) => {
  const dispatch = useDispatch<AppDispatch>();

  const tasks = useSelector((state: RootState) => selectColumnTasks(state, columnId));

  const loading = useSelector((state: RootState) => state.todos.loading);
  const error = useSelector((state: RootState) => state.todos.error);

  useEffect(() => {
    // Диспетчимо отримання тасків при завантаженні компонента
    dispatch(fetchTasks({ boardId, columnId }));
  }, [dispatch, boardId, columnId]);

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        <ul>
          {tasks.map((task: Task) => (
            <li key={task.id}>
              <strong>{task.title}</strong>
              <p>{task.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;

