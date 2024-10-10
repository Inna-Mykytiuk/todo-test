import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBoards, createBoard, updateBoard, deleteBoard } from "../store/board-slice";
import { RootState, AppDispatch } from "../store/store";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import InputField from "../components/InputField";
import { GoPlus } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";
import { IoCreateOutline } from "react-icons/io5";
import { CiSaveDown1 } from "react-icons/ci";


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
    <>
      <header className="w-full bg-gradient py-[20px] shadow-lg">
        <h1 className="text-4xl text-center text-white">Kanban Boards</h1>
      </header>
      <section className="w-full py-[50px]">
        <div className="container">
          <div className="flex flex-col max-w-[500px] mx-auto gap-[20px]">
            <div className="w-full flex flex-col gap-[20px] mb-[40px]">
              <div className="flex w-full gap-4 justify-between">
                <InputField
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter board name"
                />
                <button
                  type="submit"
                  onClick={handleCreateBoard}
                  aria-label="Create Board"
                  className="flex items-center justify-center w-[42px] h-[42px] p-2 text-gray-300 hover:border-mainBcg hover:text-mainBcg transition-all duration-300 ease-out rounded-full border-gray-300 border text-2xl shadow-input"
                >
                  <GoPlus />
                </button>
              </div>

              <div className="flex w-full gap-4 justify-between">
                <InputField
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by board name"
                />
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear Search"
                  className="flex items-center justify-center w-[42px] h-[42px] p-2 text-gray-300 hover:border-mainBcg hover:text-mainBcg transition-all duration-300 ease-out rounded-full border-gray-300 border text-2xl shadow-input"
                >
                  <IoCloseOutline />
                </button>
              </div>
            </div>

            {loading && <p> Please wait for a response from the server...Data is loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {filteredBoards.length > 0 ? (
              filteredBoards.map((board) => (
                <div
                  key={board._id}
                  className="card-wrapper backlog-color"
                >
                  {isEditing === board._id ? (
                    <div className="w-full flex p-6 items-center gap-4">
                      <InputField
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                        onKeyDown={(e) => handleEditKeyDown(e, board._id)}
                        placeholder="Enter board name"
                      />
                      <div className="flex items-center">
                        <button type="button" onClick={() => handleUpdateBoard(board._id)}
                          aria-label="Save Board"
                          className="flex items-center justify-center w-[30px] h-[30px] text-gray-400 hover:text-mainBcg transition-all duration-300 ease-out text-4xl"
                        >
                          <CiSaveDown1 />
                        </button>
                        <button type="button" onClick={() => setIsEditing(null)}
                          aria-label="Cancel Edit"
                          className="flex items-center justify-center w-[30px] h-[30px] text-gray-400 hover:text-red-400 transition-all duration-300 ease-out text-4xl"
                        >
                          <IoCloseOutline />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col p-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">{board.name}</h3>
                        <div className="flex gap-4">
                          <button type="button" onClick={() => { setIsEditing(board._id); setUpdatedName(board.name); }}
                            aria-label="Edit Board"
                            className="flex items-center justify-center w-[24px] h-[24px] text-gray-400 hover:text-mainBcg transition-all duration-300 ease-out text-2xl shadow-input"
                          >
                            <IoCreateOutline />
                          </button>
                          <button type="button" onClick={() => handleDeleteBoard(board._id)}
                            aria-label="Delete Board"
                            className="flex items-center justify-center w-[24px] h-[24px] text-gray-400 hover:text-red-400 transition-all duration-300 ease-out text-2xl shadow-input"
                          >
                            <IoCloseOutline />
                          </button>
                        </div>
                      </div>
                      <Link
                        to={`/boards/${board._id}`}
                        className="group flex items-center gap-2 text-gray-400 text-base mt-4 hover:text-mainBcg transition-all duration-300 ease-out"
                      >
                        Create Task
                        <GoPlus
                          className="w-[24px] h-[24px] p-1 text-gray-400 group-hover:text-mainBcg rounded-full border border-dashed border-gray-400 group-hover:border-mainBcg text-2xl shadow-input transition-all duration-300 ease-out"
                        />
                      </Link>
                    </div>
                  )}
                </div>
              ))
            ) : (
              !loading && <p className="text-red-500">No boards available</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default BoardList;
