import { CalendarDays, Check, Circle, Clock3, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

function dateLabel(date) {
  if (!date) return "No due date";
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const overdue = task.dueDate && new Date(task.dueDate) < new Date(new Date().toDateString()) && task.status !== "Completed";

  return (
    <article className={`task-card ${task.status === "Completed" ? "task-complete" : ""}`}>
      <button className={`complete-toggle ${task.status === "Completed" ? "is-checked" : ""}`}
        onClick={() => onStatusChange(task, task.status === "Completed" ? "To Do" : "Completed")}
        aria-label={task.status === "Completed" ? "Mark as not completed" : "Mark as completed"}>
        {task.status === "Completed" ? <Check size={15} /> : <Circle size={18} />}
      </button>
      <div className="task-main">
        <div className="task-topline">
          <span className={`priority-dot priority-${task.priority.toLowerCase()}`}></span>
          <span className="priority-label">{task.priority} priority</span>
          <div className="task-menu-wrap">
            <button className="icon-button small" onClick={() => setMenuOpen(!menuOpen)} aria-label="Task actions"><MoreHorizontal size={19} /></button>
            {menuOpen && <div className="task-menu">
              <button onClick={() => { setMenuOpen(false); onEdit(task); }}><Pencil size={14} /> Edit task</button>
              <button className="danger-text" onClick={() => { setMenuOpen(false); onDelete(task); }}><Trash2 size={14} /> Delete task</button>
            </div>}
          </div>
        </div>
        <h3 className="task-title">{task.title}</h3>
        {task.description && <p className="task-description">{task.description}</p>}
        <div className="task-bottom">
          <span className={`status-pill status-${task.status.toLowerCase().replaceAll(" ", "-")}`}>
            {task.status === "In Progress" ? <Clock3 size={12} /> : task.status === "Completed" ? <Check size={12} /> : <Circle size={10} />}
            {task.status}
          </span>
          <span className={`due-date ${overdue ? "overdue" : ""}`}><CalendarDays size={13} /> {overdue ? "Overdue · " : ""}{dateLabel(task.dueDate)}</span>
        </div>
      </div>
    </article>
  );
}
