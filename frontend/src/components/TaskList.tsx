import React, { useEffect, useState } from "react";
import { IoCreateOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";

import { Draggable, Droppable } from "@hello-pangea/dnd";

import type { AppDispatch, RootState } from "../store/store";
import { deleteTask, fetchTasks, updateTask } from "../store/todo-slice";
import { addTask } from "../store/todo-slice";
import { selectColumnTasks } from "../store/selectors";
import type { Task } from "../store/todo-slice";
import Modal from "./Modal";

interface TaskListProps {
  boardId: string;
  columnId: string;
}

const TaskList: React.FC<TaskListProps> = ({ boardId, columnId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) =>
    selectColumnTasks(state, columnId)
  );
  const loading = useSelector(
    (state: RootState) => state.todos.loading[columnId]
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
        })
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
                      className="cursor-drag flex flex-col rounded bg-white p-2"
                    >
                      <div className="flex justify-between">
                        <h3 className="text-base font-bold">{task.title}</h3>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateTask(task)}
                            aria-label="Edit task"
                            className="flex h-[24px] w-[24px] items-center justify-center text-2xl text-gray-400 shadow-input transition-all duration-300 ease-out hover:text-mainBcg"
                          >
                            <IoCreateOutline />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(task.id)}
                            aria-label="Delete task"
                            className="flex h-[30px] w-[30px] items-center justify-center text-4xl text-gray-400 transition-all duration-300 ease-out hover:text-red-400"
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
