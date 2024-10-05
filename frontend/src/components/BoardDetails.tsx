import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoards, loadBoardsFromLocalStorage, setBoards } from '../store/board-slice';
import type { RootState, AppDispatch } from "../store/store";
import { Board } from '../store/board-slice';
import TaskList from './TaskList';
import Modal from './Modal';
import { addTask } from '../store/todo-slice';

export default function BoardDetails() {
  const dispatch = useDispatch<AppDispatch>();
  const { boardId } = useParams<{ boardId: string }>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [localBoards, setLocalBoards] = useState<Board[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentColumnId, setCurrentColumnId] = useState<string | null>(null);

  const board = useSelector((state: RootState) =>
    state.boards.boards.find((b) => b._id === boardId)
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
  };

  return (
    <div>
      <h1>{board.name} - Деталі</h1>
      {board.columns.map((column) => (
        <div key={column._id}>
          <h2>{column.title}</h2>
          <button type="button" onClick={() => handleOpenModal(column._id)}>+ Add Task</button>
          <TaskList boardId={boardId} columnId={column._id} />
        </div>
      ))}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveTask} />
    </div>
  );
}
