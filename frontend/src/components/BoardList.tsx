import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBoards, createBoard, updateBoard, deleteBoard } from "../store/board-slice";
import type { RootState, AppDispatch } from "../store/store";
import { Link } from "react-router-dom";

const BoardList: React.FC = () => {
  const { boards, loading, error } = useSelector((state: RootState) => state.boards);
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
      dispatch(fetchBoards());
      setBoardName("");
    }
  };

  const handleClearInput = () => {
    setBoardName("");
  };

  const handleUpdateBoard = (id: string) => {
    if (updatedName.trim()) {
      dispatch(updateBoard({ id, name: updatedName }));
      setIsEditing(null);
    }
  };

  const handleDeleteBoard = (id: string) => {
    dispatch(deleteBoard(id)).then(() => {
      dispatch(fetchBoards()); // Повторно завантажити дані
    });
  };

  return (
    <div>
      <div>
        <h2>Create a New Board</h2>
        <input
          type="text"
          placeholder="Enter board name"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
        />
        <button onClick={handleCreateBoard}>Create Board</button>
        <button onClick={handleClearInput}>Clear</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {Array.isArray(boards) && boards.length > 0 ? (
        boards.map((board) => (
          <div key={board.id} className="board">
            {isEditing === board.id ? (
              <div>
                <input
                  placeholder="Enter board name"
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                />
                <button onClick={() => handleUpdateBoard(board._id)}>Save</button>
                <button onClick={() => setIsEditing(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <h3>{board.name}</h3>
                <Link to={`/boards/${board.id}`}>View Details</Link> {/* Link to board details */}
                <button
                  onClick={() => {
                    setIsEditing(board._id);
                    setUpdatedName(board.name);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => handleDeleteBoard(board._id)}>Delete</button>
              </div>
            )}
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
        ))
      ) : (
        <p>No boards available</p>
      )}
    </div>
  );
};

export default BoardList;
