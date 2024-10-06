import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBoards, createBoard, updateBoard, deleteBoard } from "../store/board-slice";
import { RootState, AppDispatch } from "../store/store";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import InputField from "../components/InputField";  // Імпорт нового компонента

const BoardList: React.FC = () => {
  const { boards, loading, error } = useSelector((state: RootState) => state.boards);
  const dispatch = useDispatch<AppDispatch>();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [updatedName, setUpdatedName] = useState("");
  const [boardName, setBoardName] = useState("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredBoards, setFilteredBoards] = useState(boards);

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = boards.filter(board =>
        board.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBoards(filtered);
    } else {
      setFilteredBoards(boards);
    }
  }, [boards, searchTerm]);

  const handleCreateBoard = async () => {
    if (!boardName.trim()) {
      toast.error("Please fill in the board name!");
      return;
    }
    await dispatch(createBoard(boardName));
    setBoardName("");
    toast.success("Board created successfully!");
  };

  const handleUpdateBoard = async (id: string) => {
    if (!updatedName.trim()) {
      toast.error("Please fill in the new board name!");
      return;
    }
    await dispatch(updateBoard({ id, name: updatedName }));
    setIsEditing(null);
    toast.success("Board updated successfully!");
  };

  const handleDeleteBoard = async (id: string) => {
    await dispatch(deleteBoard(id));
    toast.success("Board deleted successfully!");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCreateBoard();
    } else if (e.key === "Escape") {
      setBoardName("");
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === "Enter") {
      handleUpdateBoard(id);
    } else if (e.key === "Escape") {
      setIsEditing(null);
    }
  };

  return (
    <section className="w-full py-[100px]">
      <div className="container">
        <div>
          <h2>Create a New Board</h2>
          <InputField
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter board name"
          />
          <button type="submit" onClick={handleCreateBoard}>Create Board</button>
        </div>

        <div>
          <h2>Search Board by Name</h2>
          <InputField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by board name"
          />
          <button type="button" onClick={() => setSearchTerm("")}>Clear Search</button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

        {filteredBoards.length > 0 ? (
          filteredBoards.map((board) => (
            <div key={board._id} className="board">
              {isEditing === board._id ? (
                <div>
                  <InputField
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    onKeyDown={(e) => handleEditKeyDown(e, board._id)}
                    placeholder="Enter board name"
                  />
                  <button type="button" onClick={() => handleUpdateBoard(board._id)}>Save</button>
                  <button type="button" onClick={() => setIsEditing(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <h3>{board.name}</h3>
                  <Link to={`/boards/${board._id}`}>View Details</Link>
                  <button onClick={() => { setIsEditing(board._id); setUpdatedName(board.name); }}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDeleteBoard(board._id)}>Delete</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No boards available</p>
        )}
      </div>
    </section>
  );
};

export default BoardList;
