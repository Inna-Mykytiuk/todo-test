// // Task.tsx
// import React from "react";
// import type { Task } from "../store/todo-slice";

// interface TaskProps {
//   task: Task;
//   onDragStart: (e: React.DragEvent, taskId: string) => void;
// }

// const Task: React.FC<TaskProps> = ({ task, onDragStart }) => {
//   return (
//     <li
//       key={task.id}
//       draggable
//       onDragStart={(e) => onDragStart(e, task.id)}
//       className="cursor-pointer border p-2 mb-2 rounded"
//     >
//       <strong>{task.title}</strong>
//       <p>{task.description}</p>
//     </li>
//   );
// };

// export default Task;