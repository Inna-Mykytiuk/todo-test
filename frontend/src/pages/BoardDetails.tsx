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

    // Логування результату перетягування
    console.log("Drag result:", result);

    if (destination.droppableId === source.droppableId) {
      // Переміщення в межах однієї колонки
      const columnId = destination.droppableId;
      const taskId = result.draggableId;

      // Виклик функції переміщення таски всередині колонки
      await dispatch(moveTaskWithinColumn({ boardId, columnId, taskId, targetIndex: destination.index }));
      console.log(`Таска ${taskId} переміщена в колонці ${columnId} на позицію ${destination.index}`);
    } else {
      // Переміщення між колонками
      const sourceColumnId = source.droppableId;
      const destColumnId = destination.droppableId;
      const taskId = result.draggableId;

      // Виклик функції переміщення задачі
      await dispatch(moveTaskAction({ boardId, sourceColumnId, destColumnId, taskId }));
    }

    // Отримуємо нові задачі для кожної колонки
    await Promise.all(
      board.columns.map((column) =>
        dispatch(fetchTasks({ boardId, columnId: column._id }))
      )
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <h1>{board.name} - Деталі</h1>
        {board.columns.map((column) => (
          <div key={column._id}>
            <h2>{column.title}</h2>
            <button type="button" onClick={() => handleOpenModal(column._id)}>+ Додати задачу</button>
            <TaskList columnId={column._id} boardId={boardId} />
          </div>
        ))}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveTask} />
      </div>
    </DragDropContext>
  );
}
