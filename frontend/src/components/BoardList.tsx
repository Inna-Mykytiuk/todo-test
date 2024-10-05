import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../store/board-slice";
import type { RootState, AppDispatch } from "../store/store";
import { Link } from "react-router-dom";


const BoardList: React.FC = () => {
  const { boards, loading, error } = useSelector(
    (state: RootState) => state.boards
  );
  const dispatch = useDispatch<AppDispatch>();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [updatedName, setUpdatedName] = useState("");
  const [boardName, setBoardName] = useState("");


  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  const handleCreateBoard = async () => {
    if (boardName.trim()) {
      await dispatch(createBoard(boardName));
      setBoardName("");
    }
  };

  const handleUpdateBoard = async (id: string) => {
    if (updatedName.trim()) {
      await dispatch(updateBoard({ id, name: updatedName }));
      setIsEditing(null);
    }
  };

  const handleDeleteBoard = async (id: string) => {
    await dispatch(deleteBoard(id));
  };


  return (
    <div className="container">
      <div>
        <h2>Create a New Board</h2>
        <input
          type="text"
          placeholder="Enter board name"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
        />
        <button type="submit" onClick={handleCreateBoard}>
          Create Board
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {boards.length > 0 ? (
        boards.map((board) => (
          <div key={board._id} className="board">
            {isEditing === board._id ? (
              <div>
                <input
                  placeholder="Enter board name"
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                />
                <button type="button" onClick={() => handleUpdateBoard(board._id)}>
                  Save
                </button>
                <button type="button" onClick={() => setIsEditing(null)}>
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h3>{board.name}</h3>
                <Link to={`/boards/${board._id}`}>View Details</Link>
                <button
                  onClick={() => {
                    setIsEditing(board._id);
                    setUpdatedName(board.name);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => handleDeleteBoard(board._id)}>
                  Delete
                </button>
              </div>
            )}

            {/* New block to display columns and tasks */}
            <div className="columns">
              {board.columns.map((column) => (
                <div key={column._id} className="column">
                  <h4>{column.title}</h4>
                  <ul>
                    {column.tasks.map((task) => (
                      <li key={`${task._id}-${task.title}`}>
                        <h5>{task.title}</h5>
                        <p>{task.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No boards available</p>
      )}
    </div>
  );
};

export default BoardList;
