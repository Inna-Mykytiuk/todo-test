// src/components/BoardDetails.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Board } from '@/store/board-slice';

const BoardDetails: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const boards = useSelector((state: RootState) => state.boards.boards);

  const board = boards.find((b: Board) => b.id === boardId);

  if (!board) {
    return <p>Board not found</p>;
  }

  return (
    <div>
      <h2>{board.name}</h2>
      <div className="columns">
        {board.columns.map((column, index) => (
          <div key={index} className="column">
            <h4>{column.title}</h4>
            <ul>
              {column.tasks.map((task) => (
                <li key={task.id}>{task.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardDetails;
