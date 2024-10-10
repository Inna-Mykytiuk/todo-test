import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Droppable, Draggable } from "@hello-pangea/dnd";
import { ThreeDots } from "react-loader-spinner";

import { fetchTasks, deleteTask, updateTask } from "../store/todo-slice";
import { selectColumnTasks, addTask } from "../store/todo-slice";
import type { RootState, AppDispatch } from "../store/store";
import type { Task } from "../store/todo-slice";

import { IoCreateOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";

import Modal from "./Modal";

interface TaskListProps {
  boardId: string;
  columnId: string;
}

const TaskList: React.FC<TaskListProps> = ({ boardId, columnId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) =>
    selectColumnTasks(state, columnId),
  );
  const loading = useSelector(
    (state: RootState) => state.todos.loading[columnId],
  );
  const error = useSelector((state: RootState) => state.todos.error[columnId]);
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
      await dispatch(
        updateTask({
          boardId,
          columnId,
          taskId: currentTask.id,
          title,
          description,
        }),
      );
    } else {
      await dispatch(addTask({ boardId, columnId, title, description }));
    }
    handleCloseModal();
  };

  if (loading) {
    return (
      <>
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
      </>
    );
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
            <ul className="flex flex-col gap-4">
              {tasks.map((task: Task, index: number) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex flex-col bg-white p-2 rounded cursor-drag"
                    >
                      <div className="flex justify-between">
                        <h3 className="text-base font-bold">{task.title}</h3>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateTask(task)}
                            aria-label="Edit task"
                            className="flex items-center justify-center w-[24px] h-[24px] text-gray-400 hover:text-mainBcg transition-all duration-300 ease-out text-2xl shadow-input"
                          >
                            <IoCreateOutline />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(task.id)}
                            aria-label="Delete task"
                            className="flex items-center justify-center w-[30px] h-[30px] text-gray-400 hover:text-red-400 transition-all duration-300 ease-out text-4xl"
                          >
                            <IoCloseOutline />
                          </button>
                        </div>
                      </div>
                      <p>{task.description}</p>
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
