import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, ArrowDownUp, CheckCircle2, CircleDashed, ClipboardList, ListTodo, Plus, Search, Sparkles, Target } from "lucide-react";
import { taskApi } from "./api.js";
import TaskCard from "./components/TaskCard.jsx";
import TaskForm from "./components/TaskForm.jsx";

const tabs = [
  { label: "All tasks", value: "All" },
  { label: "To Do", value: "To Do" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" }
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try { setTasks(await taskApi.list()); }
    catch (err) { setError(`${err.message} Check that the backend is running and MongoDB is connected.`); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const stats = useMemo(() => {
    const completed = tasks.filter(t => t.status === "Completed").length;
    const inProgress = tasks.filter(t => t.status === "In Progress").length;
    const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date(new Date().toDateString()) && t.status !== "Completed").length;
    return [
      { label: "Total tasks", value: tasks.length, icon: ClipboardList, color: "violet", note: "Across your workspace" },
      { label: "In progress", value: inProgress, icon: Activity, color: "blue", note: "Keep the momentum" },
      { label: "Completed", value: completed, icon: CheckCircle2, color: "green", note: tasks.length ? `${Math.round(completed / tasks.length * 100)}% of all tasks` : "Your wins start here" },
      { label: "Overdue", value: overdue, icon: CircleDashed, color: "orange", note: "Need your attention" }
    ];
  }, [tasks]);

  const filteredTasks = useMemo(() => tasks.filter(task => {
    const query = search.toLowerCase().trim();
    const matchesSearch = !query || task.title.toLowerCase().includes(query) || (task.description || "").toLowerCase().includes(query);
    return matchesSearch && (statusFilter === "All" || task.status === statusFilter) && (priorityFilter === "All" || task.priority === priorityFilter);
  }), [tasks, search, statusFilter, priorityFilter]);

  async function saveTask(payload) {
    setSaving(true);
    try {
      if (editingTask) await taskApi.update(editingTask._id, payload);
      else await taskApi.create(payload);
      setFormOpen(false); setEditingTask(null);
      setToast(editingTask ? "Task updated successfully" : "Task created successfully");
      await loadTasks();
    } finally { setSaving(false); }
  }

  async function deleteTask(task) {
    if (!window.confirm(`Delete "${task.title}"? This action cannot be undone.`)) return;
    try {
      await taskApi.remove(task._id);
      setTasks(current => current.filter(t => t._id !== task._id));
      setToast("Task deleted");
    } catch (err) { setError(err.message); }
  }

  async function changeStatus(task, status) {
    try {
      const updated = await taskApi.update(task._id, { status });
      setTasks(current => current.map(t => t._id === task._id ? updated : t));
      setToast(status === "Completed" ? "Nice work — task completed!" : "Task moved back to To Do");
    } catch (err) { setError(err.message); }
  }

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  function openCreate() { setEditingTask(null); setFormOpen(true); }
  function openEdit(task) { setEditingTask(task); setFormOpen(true); }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a href="#" className="brand" aria-label="TaskFlow home"><span className="brand-mark"><Target size={21} /></span><span>taskflow<span className="brand-period">.</span></span></a>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav">
          <button className="nav-item active"><ListTodo size={18} /> <span>My tasks</span><span className="nav-count">{tasks.length}</span></button>
          <button className="nav-item" onClick={() => setStatusFilter("In Progress")}><Activity size={18} /><span>In progress</span></button>
          <button className="nav-item" onClick={() => setStatusFilter("Completed")}><CheckCircle2 size={18} /><span>Completed</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip"><Sparkles size={17} /><strong>Small steps, big wins.</strong><p>Stay focused on what matters. Progress is progress.</p></div>
          <div className="profile"><div className="avatar">M</div><div><strong>My workspace</strong><span>Personal plan</span></div><span className="online-dot"></span></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>My tasks</strong></div><div className="topbar-right"><span className="today-label">{new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</span><div className="avatar top-avatar">M</div></div></header>
        <section className="page-content">
          <div className="welcome-row">
            <div><p className="eyebrow">YOUR PERSONAL WORKSPACE</p><h1>Make today count<span>.</span></h1><p className="subtitle">A little progress each day adds up to big results.</p></div>
            <button className="button button-primary create-button" onClick={openCreate}><Plus size={17} /> New task</button>
          </div>

          <section className="stats-grid" aria-label="Task statistics">
            {stats.map(({ label, value, icon: Icon, color, note }) => <article className="stat-card" key={label}>
              <div className="stat-top"><span>{label}</span><span className={`stat-icon ${color}`}><Icon size={18} /></span></div>
              <div className="stat-value">{value}</div><div className="stat-note">{note}</div>
            </article>)}
          </section>

          <section className="tasks-section">
            <div className="section-heading"><div><h2>Your tasks</h2><p>Organize your work, one task at a time.</p></div><span className="result-count">{filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}</span></div>
            <div className="toolbar">
              <div className="search-box"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." aria-label="Search tasks" /><kbd>⌕</kbd></div>
              <div className="filter-control"><ArrowDownUp size={15} /><select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} aria-label="Filter by priority"><option value="All">All priorities</option><option>High</option><option>Medium</option><option>Low</option></select></div>
            </div>
            <div className="tabs" role="tablist" aria-label="Filter tasks by status">
              {tabs.map(tab => <button key={tab.value} role="tab" aria-selected={statusFilter === tab.value} className={`tab ${statusFilter === tab.value ? "selected" : ""}`} onClick={() => setStatusFilter(tab.value)}>{tab.label}{tab.value === "All" && <span>{tasks.length}</span>}</button>)}
            </div>
            {error && <div className="error-banner" role="alert"><strong>Something needs attention</strong><span>{error}</span><button onClick={() => setError("")} aria-label="Dismiss error">×</button></div>}
            {loading ? <div className="empty-state"><div className="loading-spinner"></div><h3>Loading your tasks...</h3><p>Getting your workspace ready.</p></div> :
              filteredTasks.length ? <div className="task-list">{filteredTasks.map(task => <TaskCard key={task._id} task={task} onEdit={openEdit} onDelete={deleteTask} onStatusChange={changeStatus} />)}</div> :
              <div className="empty-state"><div className="empty-icon"><ClipboardList size={25} /></div><h3>{tasks.length ? "No tasks match these filters" : "A fresh start"}</h3><p>{tasks.length ? "Try a different search or filter to find your task." : "Your task list is clear. Add your first task and get going."}</p>{!tasks.length && <button className="button button-primary" onClick={openCreate}><Plus size={16} /> Create your first task</button>}</div>}
          </section>
          <footer className="footer"><span>© {new Date().getFullYear()} TaskFlow</span><span>Made for focused work <span className="footer-heart">♥</span></span></footer>
        </section>
      </main>

      {formOpen && <TaskForm task={editingTask} onClose={() => { setFormOpen(false); setEditingTask(null); }} onSave={saveTask} saving={saving} />}
      {toast && <div className="toast" role="status"><CheckCircle2 size={17} />{toast}</div>}
    </div>
  );
}
