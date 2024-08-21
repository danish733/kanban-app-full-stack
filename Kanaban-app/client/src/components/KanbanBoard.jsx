import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './kanban.css';

function KanbanBoard() {
  const [addTask, setAddTask] = useState("");
  const [editTask, setEditTask] = useState(null); // Track the task being edited
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const { data } = await axios.get('https://kanban-app-full-stack.onrender.com/kanban', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCreateTask = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const newTask = {
        title: addTask,
        status: 'to-do' // Assuming default status is "to-do"
      };

      await axios.post('https://kanban-app-full-stack.onrender.com/kanban/create', 
        newTask, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks(); // Refresh tasks after creation
      setAddTask(""); // Clear input
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.patch(`https://kanban-app-full-stack.onrender.com/kanban/update/${taskId}`, 
        { title: editTask.title, status: editTask.status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks(); // Refresh tasks after update
      setEditTask(null); // Clear editing state
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
     const response = await axios.delete(`https://kanban-app-full-stack.onrender.com/kanban/delete/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(response.data)
      fetchTasks(); // Refresh tasks after deletion
    } catch (error) {
      alert("user are not admin")
      console.error('Error deleting task:', error);
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("text", taskId);
  };

  const handleDrop = async (e, status) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    const taskId = e.dataTransfer.getData("text");
    try {
      await axios.patch(`https://kanban-app-full-stack.onrender.com/kanban/update/${taskId}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks(); // Refresh tasks after status update
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const filterTasks = (status) => {
    return tasks.filter(task => task.status === status);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (!localStorage.getItem("token")) {
    return null; // Don't render anything if token is not present
  }

  return (
    <>
      <div className="kanban-header">
        <h1>Welcome to Kanban Board</h1>
        <button onClick={() => { localStorage.removeItem("token"); navigate('/login'); }} className="logout-button">Logout</button>
      </div>
      <div className="kanban-create">
        <label htmlFor="task-input">Create Task</label>
        <input
          type="text"
          id="task-input"
          placeholder="Input task"
          value={addTask}
          onChange={(e) => setAddTask(e.target.value)}
        />
        <button onClick={handleCreateTask}>Create Task</button>
      </div>
      <div className="kanban-columns">
        {['to-do', 'in-progress', 'completed'].map(status => (
          <div
            key={status}
            className="kanban-column"
            onDrop={(e) => handleDrop(e, status)}
            onDragOver={(e) => e.preventDefault()}
          >
            <label htmlFor={status}>{status.replace('-', ' ').toUpperCase()}</label>
            <div id={status}>
              {filterTasks(status).map(task => (
                <div
                  key={task._id}
                  className="kanban-task"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task._id)}
                >
                  {editTask && editTask._id === task._id ? (
                    <div>
                      <input
                        type="text"
                        value={editTask.title}
                        onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                      />
                      <select
                        value={editTask.status}
                        onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
                      >
                        <option value="to-do">To-Do</option>
                        <option value="in-progress">In-Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button onClick={() => handleUpdateTask(task._id)}>Update</button>
                      <button onClick={() => setEditTask(null)}>Cancel</button>
                    </div>
                  ) : (
                    <div>
                      <h4>{task.title}</h4>
                      <p>Status: {task.status}</p>
                      <button onClick={() => setEditTask({ ...task })}>Edit</button>
                      <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default KanbanBoard;




