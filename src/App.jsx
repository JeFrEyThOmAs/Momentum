"use client";
import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Outlet, Navigate } from 'react-router-dom';

// --- Firebase Integration ---
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAJkb-NbtfuWMGnNljF85Z9UenDcfNhgRo",
    authDomain: "hackathon-82381.firebaseapp.com",
    projectId: "hackathon-82381",
    storageBucket: "hackathon-82381.appspot.com", // Corrected storage bucket domain
    messagingSenderId: "894106093680",
    appId: "1:894106093680:web:22b4ad8f453699c34c0cb5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// --- Recharts (Charting Library) Setup ---
const Recharts = window.Recharts;
const { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } = Recharts || {};

// --- Polyfill for useAnimationFrame ---
const useAnimationFrame = (callback) => {
    const callbackRef = useRef(callback);
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        let frameId;
        const loop = (time) => {
            frameId = requestAnimationFrame(loop);
            callbackRef.current(time);
        };
        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, []);
};

// --- MOCK DATA ---
const initialTargets = [ { id: 1, name: 'DSA', goal: 60, progress: 45 }, { id: 2, name: 'Backend Dev', goal: 120, progress: 90 }, { id: 3, name: 'Project Work', goal: 90, progress: 30 }, ];
const initialTodos = [ { id: 1, text: 'Finish chapter 4 of DSA book', completed: true }, { id: 2, text: 'Build API endpoint for user profiles', completed: false }, { id: 3, text: 'Deploy the staging server', completed: false }, ];
const analyticsData = [ { name: 'Mon', study: 240, break: 60 }, { name: 'Tue', study: 180, break: 45 }, { name: 'Wed', study: 300, break: 75 }, { name: 'Thu', study: 220, break: 90 }, { name: 'Fri', study: 280, break: 50 }, { name: 'Sat', study: 350, break: 100 }, { name: 'Sun', study: 120, break: 30 }, ];

// --- STYLES ---
const GlobalStyles = () => (
    <style>{`
        /* ... (styles remain the same) ... */
        :root { --hue-1-transparent: rgba(66, 153, 225, 0.4); --hue-2-transparent: rgba(72, 187, 120, 0.4); --hue-3-transparent: rgba(245, 101, 101, 0.4); --hue-4-transparent: rgba(237, 137, 54, 0.4); --hue-5-transparent: rgba(213, 63, 140, 0.4); --hue-6-transparent: rgba(159, 122, 234, 0.4); }
        body { margin: 0; font-family: sans-serif; background-color: #0D1117; color: #f7fafc; }
        .background-cube-wrapper { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; z-index: 0; opacity: 0.2; overflow: hidden; }
        .app-container { position: relative; z-index: 1; min-height: 100vh; padding: 1.5rem; }
        .app-header { max-width: 80rem; margin: 0 auto 2rem auto; display: flex; justify-content: space-between; align-items: center; }
        .header-title-container { flex-grow: 1; }
        .header-title { font-size: 2.25rem; font-weight: bold; display: flex; align-items: center; }
        .header-emoji { color: #63b3ed; margin-right: 0.75rem; }
        .header-subtitle { color: #a0aec0; }
        .main-grid { max-width: 80rem; margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        .column-left, .column-right { display: flex; flex-direction: column; gap: 1.5rem; }
        .user-menu { position: relative; }
        .user-icon { background-color: #4a5568; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .user-dropdown { position: absolute; top: 50px; right: 0; background-color: #2d3748; border-radius: 0.5rem; border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden; z-index: 10; }
        .user-dropdown button { background: none; border: none; color: white; padding: 0.75rem 1.5rem; width: 100%; text-align: left; cursor: pointer; }
        .user-dropdown button:hover { background-color: #4a5568; }
        .auth-page { max-width: 400px; margin: 4rem auto; }
        .auth-form { display: flex; flex-direction: column; gap: 1rem; }
        .auth-form input { background-color: #4a5568; color: white; padding: 0.75rem; border-radius: 0.375rem; border: 1px solid transparent; }
        .auth-form input:focus { outline: none; border-color: #4299e1; }
        .auth-form button { background-color: #4299e1; color: white; padding: 0.75rem; border-radius: 0.375rem; border: none; font-weight: bold; cursor: pointer; }
        .auth-switch { color: #a0aec0; text-align: center; margin-top: 1rem; }
        .auth-switch a { color: #63b3ed; cursor: pointer; text-decoration: underline; }
        .card { background-color: rgba(30, 41, 59, 0.4); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: 0.75rem; padding: 1.5rem; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        .title { font-size: 1.5rem; font-weight: bold; color: white; margin-top: 0; margin-bottom: 1rem; }
        .progress-bar-label { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; color: white; }
        .progress-bar-bg { width: 100%; background-color: #4a5568; border-radius: 9999px; height: 1rem; overflow: hidden; }
        .progress-bar-fg { background-color: #4299e1; height: 100%; border-radius: 9999px; }
        .progress-bar-bg-small { width: 100%; background-color: #4a5568; border-radius: 9999px; height: 0.625rem; overflow: hidden; }
        .progress-bar-fg-small { background-color: #48bb78; height: 100%; border-radius: 9999px; }
        .summary-divider { height: 1px; background-color: rgba(255, 255, 255, 0.1); margin: 1.5rem 0; }
        .summary-break-time { display: flex; justify-content: space-between; align-items: center; }
        .summary-break-time span { font-size: 1rem; color: #a0aec0; }
        .summary-break-time .value { font-size: 1.25rem; font-weight: bold; color: #F56565; }
        .custom-targets-container { display: flex; flex-direction: column; gap: 1rem; }
        .streak-display { text-align: center; }
        .streak-value { font-size: 3rem; font-weight: bold; color: #f6ad55; }
        .streak-text { color: #a0aec0; }
        .todo-form { display: flex; margin-bottom: 1rem; }
        .todo-form input { background-color: #4a5568; color: white; border-top-left-radius: 0.375rem; border-bottom-left-radius: 0.375rem; padding: 0.5rem; flex-grow: 1; border: none; }
        .todo-form input:focus { outline: 2px solid #4299e1; }
        .todo-form button { background-color: #4299e1; color: white; padding: 0.5rem 1rem; border-top-right-radius: 0.375rem; border-bottom-right-radius: 0.375rem; border: none; cursor: pointer; }
        .todo-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
        .todo-list-item { display: flex; align-items: center; background-color: #4a5568; padding: 0.5rem; border-radius: 0.375rem; }
        .todo-text-container { flex-grow: 1; cursor: pointer; }
        .todo-list input[type="checkbox"] { margin-right: 0.5rem; width: 1rem; height: 1rem; }
        .todo-list .completed { text-decoration: line-through; color: #718096; }
        .manage-targets-form { display: flex; flex-direction: column; gap: 1rem; background-color: #1a202c; padding: 1rem; border-radius: 0.375rem; margin-bottom: 1rem; }
        .manage-targets-form input { width: 100%; background-color: #4a5568; padding: 0.5rem; border-radius: 0.375rem; color: white; border: none; box-sizing: border-box; }
        .manage-targets-form .form-input-group { display: flex; gap: 1rem; }
        .button-add-target { width: 100%; background-color: #48bb78; color: white; font-weight: bold; padding: 0.5rem 1rem; border-radius: 0.375rem; border: none; cursor: pointer; }
        .targets-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
        .targets-list li { display: flex; justify-content: space-between; align-items: center; background-color: #4a5568; padding: 0.5rem; border-radius: 0.375rem; }
        .button-delete { background: none; border: none; color: #f56565; cursor: pointer; }
        .button-delete:hover { color: #c53030; }
        .chart-container { height: 300px; }
        .chart-placeholder { background-color: rgba(74, 85, 104, 0.5); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; height: 100%; color: #718096; }
        .cube-container { perspective: 800px; width: 200px; height: 200px; }
        .cube { width: 200px; height: 200px; position: relative; transform-style: preserve-3d; }
        .side { position: absolute; width: 100%; height: 100%; border: 1px solid rgba(255, 255, 255, 0.2); }
        .front { transform: rotateY(0deg) translateZ(100px); background-color: var(--hue-1-transparent); }
        .right { transform: rotateY(90deg) translateZ(100px); background-color: var(--hue-2-transparent); }
        .back { transform: rotateY(180deg) translateZ(100px); background-color: var(--hue-3-transparent); }
        .left { transform: rotateY(-90deg) translateZ(100px); background-color: var(--hue-4-transparent); }
        .top { transform: rotateX(90deg) translateZ(100px); background-color: var(--hue-5-transparent); }
        .bottom { transform: rotateX(-90deg) translateZ(100px); background-color: var(--hue-6-transparent); }
        .loading-container { display: flex; align-items: center; justify-content: center; height: 100vh; font-size: 1.5rem; }
        @media (min-width: 1024px) { .app-container { padding: 2.5rem; } .main-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } .column-left { grid-column: span 2 / span 2; } .column-right { grid-column: span 1 / span 1; } }
    `}</style>
);

// --- Animated Cube Component ---
const AnimatedCube = () => { /* ... (component remains the same) ... */ const ref = useRef(null); useAnimationFrame((t) => { if (!ref.current) return; const rotate = Math.sin(t / 10000) * 200; const y = (1 + Math.sin(t / 1000)) * -50; ref.current.style.transform = `translateY(${y}px) rotateX(${rotate}deg) rotateY(${rotate}deg)`; }); return ( <div className="cube-container"> <div className="cube" ref={ref}> <div className="side front" /> <div className="side left" /> <div className="side right" /> <div className="side top" /> <div className="side bottom" /> <div className="side back" /> </div> </div> ); };

// --- SVG ICONS ---
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const TrashIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> );

// --- Reusable UI Components ---
const Card = ({ children, className }) => ( <div className={`card ${className || ''}`}>{children}</div> );
const Title = ({ children }) => ( <h2 className="title">{children}</h2> );

// --- PAGE COMPONENTS ---

const DashboardPage = ({ targets, todos, todoInput, setTodoInput, handleAddTodo, toggleTodo, deleteTodo, handleAddTarget, deleteTarget, streak, wastedTime }) => {
    // ... (DashboardPage component remains the same) ...
    const totalGoal = 240; const totalProgress = targets.reduce((sum, t) => sum + t.progress, 0);
    return (
        <main className="main-grid">
            <div className="column-left">
                <Card>
                    <Title>Today's Summary</Title>
                    <div>
                        <div className="progress-bar-label"><span>Overall Goal Progress</span><span>{Math.floor(totalProgress / 60)}h {totalProgress % 60}m / {Math.floor(totalGoal / 60)}h {totalGoal % 60}m</span></div>
                        <div className="progress-bar-bg"><div className="progress-bar-fg" style={{ width: `${(totalProgress / totalGoal) * 100}%` }}></div></div>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-break-time"><span>Time on Breaks:</span><span className="value">{Math.floor(wastedTime / 60)}h {wastedTime % 60}m</span></div>
                </Card>
                <Card><Title>Custom Target Progress</Title><div className="custom-targets-container">{targets.map(target => (<div key={target.id}><div className="progress-bar-label"><span>{target.name}</span><span>{target.progress}m / {target.goal}m</span></div><div className="progress-bar-bg-small"><div className="progress-bar-fg-small" style={{ width: `${(target.progress / target.goal) * 100}%` }}></div></div></div>))}</div></Card>
                <Card><Title>Weekly Productivity</Title><div className="chart-container">{Recharts ? (<ResponsiveContainer width="100%" height="100%"><BarChart data={analyticsData}><YAxis stroke="#A0AEC0" /><XAxis dataKey="name" stroke="#A0AEC0" /><Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none' }}/><Legend /><Bar dataKey="study" fill="#4299E1" name="Study (mins)" /><Bar dataKey="break" fill="#F56565" name="Break (mins)" /></BarChart></ResponsiveContainer>) : (<div className="chart-placeholder"><p>Chart will be displayed here.</p></div>)}</div></Card>
            </div>
            <div className="column-right">
                <Card>
                    <Title>Focus for Today</Title>
                    <form onSubmit={handleAddTodo} className="todo-form"><input type="text" value={todoInput} onChange={(e) => setTodoInput(e.target.value)} placeholder="Add a new task..."/><button type="submit">+</button></form>
                    <ul className="todo-list">
                        {todos.map(todo => (<li key={todo.id} className="todo-list-item"><div className="todo-text-container" onClick={() => toggleTodo(todo.id)}><input type="checkbox" checked={todo.completed} readOnly/><span className={todo.completed ? 'completed' : ''}>{todo.text}</span></div><button onClick={() => deleteTodo(todo.id)} className="button-delete"><TrashIcon/></button></li>))}
                    </ul>
                </Card>
                <Card>
                    <Title>Current Streak</Title>
                    <div className="streak-display"><div className="streak-value">🔥 {streak}</div><div className="streak-text">Days</div></div>
                </Card>
                <Card><Title>Manage Targets</Title><form onSubmit={handleAddTarget} className="manage-targets-form"><input name="name" type="text" placeholder="New Target Name" required /><div className="form-input-group"><input name="hours" type="number" placeholder="Hours" /><input name="minutes" type="number" placeholder="Minutes" /></div><button type="submit" className="button-add-target">Add Target</button></form><ul className="targets-list">{targets.map(target => (<li key={target.id}><span>{target.name} - {Math.floor(target.goal / 60)}h {target.goal % 60}m</span><button onClick={() => deleteTarget(target.id)} className="button-delete"><TrashIcon/></button></li>))}</ul></Card>
            </div>
        </main>
    );
};

const LoginPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    
    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
            console.error(err);
        }
    };
    
    return (
        <div className="auth-page">
            <Card>
                <Title>Login</Title>
                <form className="auth-form" onSubmit={handleLogin}>
                    <input name="email" type="email" placeholder="Email" required />
                    <input name="password" type="password" placeholder="Password" required />
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    <button type="submit">Login</button>
                </form>
                <p className="auth-switch">Don't have an account? <Link to="/register">Register</Link></p>
            </Card>
        </div>
    );
};

const RegisterPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    
    const handleRegister = async (e) => {
        e.preventDefault();
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;
        const confirmPassword = e.target.elements.confirmPassword.value;

        if (password !== confirmPassword) {
            return setError("Passwords do not match.");
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to create an account. The email may already be in use.');
            console.error(err);
        }
    };

    return (
        <div className="auth-page">
            <Card>
                <Title>Create Account</Title>
                <form className="auth-form" onSubmit={handleRegister}>
                    <input name="email" type="email" placeholder="Email" required />
                    <input name="password" type="password" placeholder="Password" required />
                    <input name="confirmPassword" type="password" placeholder="Confirm Password" required />
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    <button type="submit">Register</button>
                </form>
                <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
            </Card>
        </div>
    );
};

// --- Header & Layout Components ---
const Header = ({ user }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setDropdownOpen(false);
            // The onAuthStateChanged listener will handle navigation
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };
    
    const handleLogin = () => { navigate('/login'); setDropdownOpen(false); };

    return (
        <header className="app-header">
            <div className="header-title-container"><h1 className="header-title"><span className="header-emoji">🚀</span> Momentum</h1></div>
            <div className="user-menu">
                <div className="user-icon" onClick={() => setDropdownOpen(!dropdownOpen)}><UserIcon /></div>
                {dropdownOpen && (
                    <div className="user-dropdown">
                        {user ? (<button onClick={handleLogout}>Logout</button>) : (<button onClick={handleLogin}>Login</button>)}
                    </div>
                )}
            </div>
        </header>
    );
};

const Layout = ({ user }) => (
    <>
        <GlobalStyles />
        <div className="background-cube-wrapper"><AnimatedCube /></div>
        <div className="app-container">
            <Header user={user} />
            <Outlet />
        </div>
    </>
);

const ProtectedRoute = ({ user, children }) => {
    if (user === null) { // only redirect if auth state is resolved and there's no user
        return <Navigate to="/login" replace />;
    }
    return children;
};


// --- Main App Component (with Router & Firebase Auth) ---
export default function App() {
    const [user, setUser] = useState(undefined); // undefined: loading, null: not logged in, object: logged in
    
    // Listen to Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    // All application state is managed here
    const [targets, setTargets] = useState(initialTargets);
    const [todos, setTodos] = useState(initialTodos);
    const [todoInput, setTodoInput] = useState('');
    const [streak, setStreak] = useState(5);
    const [wastedTime, setWastedTime] = useState(75);

    // Event Handlers
    const handleAddTodo = (e) => { e.preventDefault(); if (todoInput.trim() === '') return; setTodos([...todos, { id: Date.now(), text: todoInput, completed: false }]); setTodoInput(''); };
    const toggleTodo = (id) => { setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo)); };
    const deleteTodo = (id) => { setTodos(todos.filter(todo => todo.id !== id)); };
    const handleAddTarget = (e) => { e.preventDefault(); const name = e.target.elements.name.value; const hours = parseInt(e.target.elements.hours.value) || 0; const minutes = parseInt(e.target.elements.minutes.value) || 0; const goalTime = (hours * 60) + minutes; if (name && goalTime > 0) { setTargets([...targets, { id: Date.now(), name, goal: goalTime, progress: 0 }]); e.target.reset(); } };
    const deleteTarget = (id) => { setTargets(targets.filter(target => target.id !== id)); };
    
    // Display a loading indicator while Firebase checks auth state
    if (user === undefined) {
        return (
            <>
                <GlobalStyles />
                <div className="loading-container">Loading...</div>
            </>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout user={user} />}>
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute user={user}>
                                <DashboardPage 
                                    targets={targets}
                                    todos={todos}
                                    todoInput={todoInput}
                                    setTodoInput={setTodoInput}
                                    handleAddTodo={handleAddTodo}
                                    toggleTodo={toggleTodo}
                                    deleteTodo={deleteTodo}
                                    handleAddTarget={handleAddTarget}
                                    deleteTarget={deleteTarget}
                                    streak={streak}
                                    wastedTime={wastedTime}
                                />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

