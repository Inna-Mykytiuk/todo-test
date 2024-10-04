import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const BoardList: React.FC = () => {
  const boards = useSelector((state: RootState) => state.boards.boards);

  return (
    <div>
      {boards.map((board) => (
        <div key={board.id} className="board">
          <h3>{board.name}</h3>
          <div className="columns">
            {board.columns.map((column, index) => (
              <div key={index} className="column">
                <h4>{column.title}</h4>
                {/* Render tasks if needed */}
                <ul>
                  {column.tasks.map((task) => (
                    <li key={task.id}>{task.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoardList;
