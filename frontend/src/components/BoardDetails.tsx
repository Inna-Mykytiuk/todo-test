import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { RootState } from '../store/store';
import { Board } from '@/store/board-slice';
import {
  createTodo,
  deleteTodo,
  updateTodo,
  fetchTodos,
} from '@/store/todo-slice';
import Modal from './Modal';
import Card from './Card';

const BoardDetails: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const dispatch = useAppDispatch();
  const boards = useAppSelector((state: RootState) => state.boards.boards);
  const todos = useAppSelector((state: RootState) => state.todos.todos);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [currentColumnId, setCurrentColumnId] = useState<string | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  useEffect(() => {
    const loadBoardsAndTodos = async () => {
      await dispatch(fetchTodos());
      setLoading(false);
    };

    loadBoardsAndTodos();
  }, [dispatch]);

  const board = boards.find((b: Board) => b._id === boardId);

  // const handleAddTask = () => {
  //   if (newTaskName.trim() === '' || newTaskDescription.trim() === '' || !currentColumnId) return;

  //   const newTask = { title: newTaskName, description: newTaskDescription, columnId: currentColumnId };
  //   console.log("New Task:", newTask); // Додайте цей рядок
  //   dispatch(createTodo(newTask));
  //   resetModal();
  // };

  const handleAddTask = async () => {
    if (newTaskName.trim() === '' || newTaskDescription.trim() === '' || !currentColumnId) return;

    const newTask = { title: newTaskName, description: newTaskDescription, columnId: currentColumnId };
    console.log("New Task:", newTask);
    await dispatch(createTodo(newTask)); // Зробіть це асинхронно
    await dispatch(fetchTodos()); // Додайте це, щоб оновити список задач
    resetModal();
  };

  const handleOpenModal = (columnId: string) => {
    setCurrentColumnId(columnId);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTodo(taskId));
  };

  const handleEditTask = (taskId: string, taskTitle: string, taskDescription: string) => {
    setCurrentTaskId(taskId);
    setNewTaskName(taskTitle);
    setNewTaskDescription(taskDescription);
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = () => {
    if (newTaskName.trim() === '' || newTaskDescription.trim() === '') return;

    dispatch(updateTodo({ id: currentTaskId!, todo: { title: newTaskName, description: newTaskDescription } }));
    resetEditModal();
  };

  const resetModal = () => {
    setNewTaskName('');
    setNewTaskDescription('');
    setIsModalOpen(false);
  };

  const resetEditModal = () => {
    setNewTaskName('');
    setNewTaskDescription('');
    setCurrentTaskId(null);
    setIsEditModalOpen(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!board) {
    return <p>Board not found</p>;
  }

  return (
    <div>
      <h2>{board.name}</h2>
      <div className="columns">
        {board.columns.map((column) => (
          <div key={column._id} className="column">
            <h4>{column.title}</h4>
            <ul>
              {todos.filter(todo => todo.columnId === column._id).map((task) => (
                <Card
                  key={task._id}
                  title={task.title}
                  description={task.description}
                  onEdit={() => handleEditTask(task._id, task.title, task.description)}
                  onDelete={() => handleDeleteTask(task._id)}
                />
              ))}
            </ul>
            <button onClick={() => handleOpenModal(column._id)}>+</button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal onClose={resetModal}>
          <h3>Add New Task</h3>
          <label>
            Task Name:
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Task name"
            />
          </label>
          <label>
            Description:
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Task description"
            />
          </label>
          <button onClick={handleAddTask}>Submit</button>
        </Modal>
      )}

      {isEditModalOpen && (
        <Modal onClose={resetEditModal}>
          <h3>Edit Task</h3>
          <label>
            Task Name:
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Task name"
            />
          </label>
          <label>
            Description:
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Task description"
            />
          </label>
          <button onClick={handleUpdateTask}>Update</button>
        </Modal>
      )}
    </div>
  );
};

export default BoardDetails;
