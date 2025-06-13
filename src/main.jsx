import { createRoot } from 'react-dom/client';
import { useState, StrictMode, useEffect } from 'react';

const App = () => {
    return (
        <div className='container'>
            <h1>To-Do List</h1>
            <Container />
        </div>
    )
}

const Container = () => {
    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    }, []);

    const [inputValue, setInputValue] = useState('');
    const [tasks, setTasks] = useState([]);

    const handleAddTask = () => {
        if (inputValue.trim() === '') return;
        const newTask = { 
            text: inputValue, 
            completed: false,
            id: Date.now()
        }
        setTasks([...tasks, newTask]);
        setInputValue('');
    };

    const handleToggleComplete = (idToToggle) => {
        const updatedTasks = tasks.map((task) =>
            task.id === idToToggle
            ? { ...task, completed: !task.completed }
            : task
        )
        updatedTasks.sort((a, b) => a.completed - b.completed)
        setTasks(updatedTasks);
    };

    const handleDeleteTask = (idToDelete) => {
        const updatedTasks = tasks.filter((task) => task.id !== idToDelete);
        setTasks(updatedTasks);
    };

    const handleSaveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    return (
        <div className='container-inner'>
            <div className='input-container'>
                <input 
                    type='text' 
                    id='main-input' 
                    autoComplete='off' 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleAddTask();
                        }
                    }} 
                />
                <button className='add-btn' onClick={handleAddTask}>Add task</button>
            </div>

            <ul aria-live='polite'>
                {tasks.map((task) => (
                    <Item 
                        key={task.id}
                        text={task.text}
                        completed={task.completed}
                        id={task.id}
                        onComplete={() => handleToggleComplete(task.id)}
                        onDelete={() => handleDeleteTask(task.id)}
                    />
                ))}
            </ul>

            <div className='button-container'>
                <button className='clear-btn' onClick={() => setTasks([])}>Clear</button>
                <button className='save-btn' onClick={handleSaveTasks}>Save</button>
            </div>
        </div>
    )
}

const Item = ({ text, completed, onComplete, onDelete }) => {
    return (
        <li className={`${completed ? 'completed' : ''}`}>
            <button className='complete-btn' onClick={onComplete}>
                <i className={`fa-regular ${completed ? 'fa-circle-check' : 'fa-circle'}`} />
            </button>
            <span className={`item-text ${completed ? 'completed' : ''}`}>{text}</span>
            <button className='delete-btn' onClick={onDelete}>
                <i className="fa-solid fa-trash-can"></i>
            </button>
        </li>
    )
}

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);