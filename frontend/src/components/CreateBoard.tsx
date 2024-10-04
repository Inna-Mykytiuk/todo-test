// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { createBoard } from "@/store/board-slice";

// const CreateBoard: React.FC = () => {
//   const [boardName, setBoardName] = useState("");
//   const dispatch = useDispatch();

//   const handleCreateBoard = () => {
//     if (boardName.trim()) {
//       dispatch(createBoard(boardName));
//       setBoardName(""); // Clear input after creation
//     }
//   };

//   return (
//     <div>
//       <h2>Create a New Board</h2>
//       <input
//         type="text"
//         placeholder="Enter board name"
//         value={boardName}
//         onChange={(e) => setBoardName(e.target.value)}
//       />
//       <button onClick={handleCreateBoard}>Create Board</button>
//     </div>
//   );
// };

// export default CreateBoard;
