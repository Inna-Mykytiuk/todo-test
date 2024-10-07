import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTask, updateTask } from "../store/todo-slice";
import { selectColumnTasks, addTask } from "../store/todo-slice";
import type { RootState, AppDispatch } from "../store/store";
import type { Task } from "../store/todo-slice";
import Modal from './Modal';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { ThreeDots } from 'react-loader-spinner'

interface TaskListProps {
  boardId: string;
  columnId: string;
}

const TaskList: React.FC<TaskListProps> = ({ boardId, columnId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => selectColumnTasks(state, columnId));
  const loading = useSelector((state: RootState) => state.todos.loading[columnId]); // Оновлено
  const error = useSelector((state: RootState) => state.todos.error[columnId]); // Оновлено
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

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
      await dispatch(updateTask({
        boardId,
        columnId,
        taskId: currentTask.id,
        title,
        description,
      }));
    } else {
      await dispatch(addTask({ boardId, columnId, title, description }));
    }
    handleCloseModal();
  };

  if (loading) {
    return (
      <div>
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#707090"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    )
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Droppable droppableId={columnId}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {tasks.length === 0 ? (
            <p>No tasks available</p>
          ) : (
            <ul>
              {tasks.map((task: Task, index: number) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <strong>{task.title}</strong>
                      <p>{task.description}</p>
                      <button type="button" onClick={() => handleUpdateTask(task)}>Update</button>
                      <button type="button" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                    </li>
                  )}
                </Draggable>
              ))}
            </ul>
          )}
          {provided.placeholder}
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveTask}
            initialTitle={currentTask?.title}
            initialDescription={currentTask?.description}
          />
        </div>
      )}
    </Droppable>
  );
};


export default TaskList;
