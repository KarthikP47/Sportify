import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';  // Import the LoginPage component
import Home from './components/Home';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Define the route for login page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Define the route for homepage */}
          <Route path="/homepage" element={<Home />} />

          {/* Redirect to homepage if no route matches */}
          <Route path="/" element={<Navigate replace to="/homepage" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
