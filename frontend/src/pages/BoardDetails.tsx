import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import { DragDropContext, DropResult } from "@hello-pangea/dnd";

import Modal from "../components/Modal";
import TaskList from "../components/TaskList";
import {
  fetchBoards,
  loadBoardsFromLocalStorage,
  setBoards,
} from "../store/board-slice";
import { Board } from "../store/board-slice";
import type { AppDispatch, RootState } from "../store/store";
import {
  addTask,
  fetchTasks,
  moveTask as moveTaskAction,
  moveTaskWithinColumn,
} from "../store/todo-slice";

export default function BoardDetails() {
  const dispatch = useDispatch<AppDispatch>();
  const { boardId } = useParams<{ boardId: string }>();

  const [localBoards, setLocalBoards] = useState<Board[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentColumnId, setCurrentColumnId] = useState<string | null>(null);

  const board = useSelector((state: RootState) =>
    state.boards.boards.find((b: Board) => b._id === boardId)
  );

  useEffect(() => {
    const loadedBoards = loadBoardsFromLocalStorage();
    if (loadedBoards.length > 0) {
      setLocalBoards(loadedBoards);
      dispatch(setBoards(loadedBoards));
    } else {
      dispatch(fetchBoards());
    }
  }, [dispatch]);

  if (!boardId || !board) {
    return <div>Борд не знайдений</div>;
  }

  const handleOpenModal = (columnId: string) => {
    setCurrentColumnId(columnId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentColumnId(null);
  };

  const handleSaveTask = async (title: string, description: string) => {
    if (currentColumnId) {
      await dispatch(
        addTask({ boardId, columnId: currentColumnId, title, description })
      );
    }
    handleCloseModal();
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    const sourceColumnId = source.droppableId;
    const destColumnId = destination.droppableId;
    const taskId = result.draggableId;

    if (destination.droppableId === source.droppableId) {
      await dispatch(
        moveTaskWithinColumn({
          boardId,
          columnId: sourceColumnId,
          taskId,
          targetIndex: destination.index,
        })
      );
    } else {
      await dispatch(
        moveTaskAction({
          boardId,
          sourceColumnId,
          destColumnId,
          taskId,
        })
      );
    }

    const updatedColumns = [sourceColumnId, destColumnId].map((columnId) =>
      dispatch(fetchTasks({ boardId, columnId }))
    );

    await Promise.all(updatedColumns);
  };

  return (
    <>
      <header className="w-full bg-gradient py-[20px] shadow-lg">
        <h1 className="text-center text-4xl text-white">{board.name} Board</h1>
        {localBoards.length > 0 && (
          <h2 className="mt-4 hidden text-center text-xl text-white">
            Local Boards Loaded
          </h2>
        )}
      </header>
      <section className="min-h-screen w-full flex-grow py-[50px]">
        <div className="container">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {board.columns.map((column) => (
                <div key={column._id} className="card-wrapper backlog-color">
                  <div className="flex h-full w-full flex-col justify-between gap-4 p-6">
                    <div className="smooth max-h-[600px] overflow-y-auto scroll-smooth">
                      <h2 className="mb-2 text-xl font-bold">{column.title}</h2>
                      <TaskList columnId={column._id} boardId={boardId} />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenModal(column._id)}
                      aria-label="Add task"
                      className="group mt-4 flex items-center justify-center gap-2 text-base text-gray-400 transition-all duration-300 ease-out hover:text-mainBcg"
                    >
                      Add Task
                      <GoPlus className="h-[24px] w-[24px] rounded-full border border-dashed border-gray-400 p-1 text-2xl text-gray-400 shadow-input transition-all duration-300 ease-out group-hover:border-mainBcg group-hover:text-mainBcg" />
                    </button>
                  </div>
                </div>
              ))}
              <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveTask}
              />
            </div>
          </DragDropContext>
          <Link
            to="/"
            className="mx-auto mt-4 flex max-w-[100px] justify-center rounded bg-gradient px-4 py-2 font-bold text-white transition-all duration-300 ease-out hover:bg-mainColor"
          >
            Go Back
          </Link>
        </div>
      </section>
    </>
  );
}
