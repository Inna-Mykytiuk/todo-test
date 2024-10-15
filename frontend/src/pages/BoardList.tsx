import React, { useEffect, useState } from "react";
import { CiSaveDown1 } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";
import { IoCreateOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import InputField from "../components/InputField";
import {
  createBoard,
  deleteBoard,
  fetchBoards,
  updateBoard,
} from "../store/board-slice";
import { AppDispatch, RootState } from "../store/store";

const BoardList: React.FC = () => {
  const { boards, loading, error } = useSelector(
    (state: RootState) => state.boards
  );
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
      const filtered = boards.filter((board) =>
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

  const handleEditKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string
  ) => {
    if (e.key === "Enter") {
      handleUpdateBoard(id);
    } else if (e.key === "Escape") {
      setIsEditing(null);
    }
  };

  return (
    <>
      <header className="w-full bg-gradient py-[20px] shadow-lg">
        <h1 className="text-center text-4xl text-white">Kanban Boards</h1>
      </header>
      <section className="w-full py-[50px]">
        <div className="container">
          <div className="mx-auto flex max-w-[500px] flex-col gap-[20px]">
            <div className="mb-[40px] flex w-full flex-col gap-[20px]">
              <div className="flex w-full justify-between gap-4">
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
                  className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-gray-300 p-2 text-2xl text-gray-300 shadow-input transition-all duration-300 ease-out hover:border-mainBcg hover:text-mainBcg"
                >
                  <GoPlus />
                </button>
              </div>

              <div className="flex w-full justify-between gap-4">
                <InputField
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by board name"
                />
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear Search"
                  className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-gray-300 p-2 text-2xl text-gray-300 shadow-input transition-all duration-300 ease-out hover:border-mainBcg hover:text-mainBcg"
                >
                  <IoCloseOutline />
                </button>
              </div>
            </div>

            {loading && (
              <p>
                {" "}
                Please wait for a response from the server...Data is loading...
              </p>
            )}
            {error && <p className="text-red-500">Error: {error}</p>}

            {filteredBoards.length > 0
              ? filteredBoards.map((board) => (
                <div key={board._id} className="card-wrapper backlog-color">
                  {isEditing === board._id ? (
                    <div className="flex w-full items-center gap-4 p-6">
                      <InputField
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                        onKeyDown={(e) => handleEditKeyDown(e, board._id)}
                        placeholder="Enter board name"
                      />
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => handleUpdateBoard(board._id)}
                          aria-label="Save Board"
                          className="flex h-[30px] w-[30px] items-center justify-center text-4xl text-gray-400 transition-all duration-300 ease-out hover:text-mainBcg"
                        >
                          <CiSaveDown1 />
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(null)}
                          aria-label="Cancel Edit"
                          className="flex h-[30px] w-[30px] items-center justify-center text-4xl text-gray-400 transition-all duration-300 ease-out hover:text-red-400"
                        >
                          <IoCloseOutline />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full flex-col p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">{board.name}</h3>
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditing(board._id);
                              setUpdatedName(board.name);
                            }}
                            aria-label="Edit Board"
                            className="flex h-[24px] w-[24px] items-center justify-center text-2xl text-gray-400 shadow-input transition-all duration-300 ease-out hover:text-mainBcg"
                          >
                            <IoCreateOutline />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBoard(board._id)}
                            aria-label="Delete Board"
                            className="flex h-[24px] w-[24px] items-center justify-center text-2xl text-gray-400 shadow-input transition-all duration-300 ease-out hover:text-red-400"
                          >
                            <IoCloseOutline />
                          </button>
                        </div>
                      </div>
                      <Link
                        to={`/boards/${board._id}`}
                        className="group mt-4 flex items-center gap-2 text-base text-gray-400 transition-all duration-300 ease-out hover:text-mainBcg"
                      >
                        Create Task
                        <GoPlus className="h-[24px] w-[24px] rounded-full border border-dashed border-gray-400 p-1 text-2xl text-gray-400 shadow-input transition-all duration-300 ease-out group-hover:border-mainBcg group-hover:text-mainBcg" />
                      </Link>
                    </div>
                  )}
                </div>
              ))
              : !loading && <p className="text-red-500">No boards available...Please create New Board</p>}
          </div>
        </div>
      </section>
    </>
  );
};

export default BoardList;
