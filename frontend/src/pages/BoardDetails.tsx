import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoards, loadBoardsFromLocalStorage, setBoards } from '../store/board-slice';
import type { RootState, AppDispatch } from "../store/store";
import { Board } from '../store/board-slice';
import TaskList from '@/components/TaskList';
import Modal from '@/components/Modal';
import { addTask, moveTask as moveTaskAction, fetchTasks, moveTaskWithinColumn } from '../store/todo-slice';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { GoPlus } from "react-icons/go";

export default function BoardDetails() {
  const dispatch = useDispatch<AppDispatch>();
  const { boardId } = useParams<{ boardId: string }>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      await dispatch(addTask({ boardId, columnId: currentColumnId, title, description }));
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
      await dispatch(moveTaskWithinColumn({
        boardId,
        columnId: sourceColumnId,
        taskId,
        targetIndex: destination.index
      }));
    } else {
      await dispatch(moveTaskAction({
        boardId,
        sourceColumnId,
        destColumnId,
        taskId
      }));
    }

    const updatedColumns = [sourceColumnId, destColumnId].map(columnId =>
      dispatch(fetchTasks({ boardId, columnId }))
    );

    await Promise.all(updatedColumns);
  };

  return (
    <>
      <header className="w-full bg-gradient py-[20px] shadow-lg">
        <h1 className="text-4xl text-center text-white">{board.name} Board</h1>
      </header>
      <section className="w-full py-[50px]">
        <div className="container">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {board.columns.map((column) => (
                <div key={column._id} className="card-wrapper backlog-color">
                  <div className='w-full h-full flex flex-col p-6 gap-4 justify-between'>
                    <div className="max-h-[600px] overflow-y-auto smooth  scroll-smooth">
                      <h2 className="text-xl font-bold mb-2">{column.title}</h2>
                      <TaskList columnId={column._id} boardId={boardId} />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenModal(column._id)}
                      aria-label="Add task"
                      className="justify-center group flex items-center gap-2 text-gray-400 text-base mt-4 hover:text-mainBcg transition-all duration-300 ease-out"
                    >
                      Add Task
                      <GoPlus
                        className="w-[24px] h-[24px] p-1 text-gray-400 group-hover:text-mainBcg rounded-full border border-dashed border-gray-400 group-hover:border-mainBcg text-2xl shadow-input transition-all duration-300 ease-out"
                      />
                    </button>
                  </div>
                </div>
              ))}
              <Modal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveTask} />
            </div>
          </DragDropContext>
        </div>
      </section>
    </>
  );
}