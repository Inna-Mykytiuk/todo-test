import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTask, updateTask } from "../store/todo-slice";
import { selectColumnTasks, addTask } from "../store/todo-slice";
import type { RootState, AppDispatch } from "../store/store";
import type { Task } from "../store/todo-slice";
import Modal from './Modal';

interface TaskListProps {
  boardId: string;
  columnId: string;
}

const TaskList: React.FC<TaskListProps> = ({ boardId, columnId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => selectColumnTasks(state, columnId));
  const loading = useSelector((state: RootState) => state.todos.loading);
  const error = useSelector((state: RootState) => state.todos.error);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [currentTask, setCurrentTask] = React.useState<Task | null>(null);

  useEffect(() => {
    dispatch(fetchTasks({ boardId, columnId }));
  }, [dispatch, boardId, columnId]);

  const handleDeleteTask = async (taskId: string) => {
    await dispatch(deleteTask({ boardId, columnId, taskId }));
  };

  const handleUpdateTask = (task: Task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
  };

  const handleSaveTask = async (title: string, description: string) => {
    if (currentTask) {
      // Update existing task
      await dispatch(updateTask({
        boardId,
        columnId,
        taskId: currentTask.id,
        title,
        description,
      }));
    } else {
      // Add new task (implement this in the parent component)
      await dispatch(addTask({ boardId, columnId, title, description }));
    }
    handleCloseModal();
  };

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
              <button onClick={() => handleUpdateTask(task)}>Update</button>
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        initialTitle={currentTask?.title}
        initialDescription={currentTask?.description}
      />
    </div>
  );
};

export default TaskList;


