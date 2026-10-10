import { useEffect, useState } from "react";
import { X } from "lucide-react";

const blankTask = { title: "", description: "", priority: "Medium", status: "To Do", dueDate: "" };

export default function TaskForm({ task, onClose, onSave, saving }) {
  const [form, setForm] = useState(blankTask);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(task ? {
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "Medium",
      status: task.status || "To Do",
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ""
    } : blankTask);
    setError("");
  }, [task]);

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.title.trim()) return setError("Please enter a task title.");
    try {
      await onSave({ ...form, title: form.title.trim(), dueDate: form.dueDate || null });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="modal-heading">
          <div>
            <p className="eyebrow">{task ? "KEEP MAKING PROGRESS" : "A LITTLE PROGRESS ADDS UP"}</p>
            <h2 id="form-title">{task ? "Edit task" : "Create a task"}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close form"><X size={19} /></button>
        </div>
        <form onSubmit={submit} className="task-form">
          <label>Task title <span className="required">*</span>
            <input name="title" value={form.title} onChange={change} maxLength="120" placeholder="e.g. Prepare project demo" autoFocus required />
          </label>
          <label>Description
            <textarea name="description" value={form.description} onChange={change} rows="3" maxLength="1000" placeholder="Add a few details..." />
          </label>
          <div className="form-grid">
            <label>Priority
              <select name="priority" value={form.priority} onChange={change}>
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </label>
            <label>Status
              <select name="status" value={form.status} onChange={change}>
                <option>To Do</option><option>In Progress</option><option>Completed</option>
              </select>
            </label>
          </div>
          <label>Due date
            <input type="date" name="dueDate" value={form.dueDate} onChange={change} />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
            <button className="button button-primary" disabled={saving}>{saving ? "Saving..." : task ? "Save changes" : "Create task"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
