import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";  // Import Navbar
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import SignPage from "./components/SignPage";
import LiveScores from "./pages/LiveScores/LiveScores";
import Standings from "./pages/Standings/Standings";
import TransferMarket from "./pages/TransferMarket/TransferMarket";
import Rumors from "./pages/Rumors/Rumors";
import MatchDetails from "./pages/MatchDetails/MatchDetails";
import Fixtures from "./pages/Fixtures/Fixtures"
import { AuthProvider } from "./components/AuthContext";
import ProfilePage from "./components/ProfilePage";
import Posts from "./pages/Posts/Posts"
function App() {
  return (
    <AuthProvider>
    <Router>
      <Navbar /> {/* Add the Navbar here */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />  
        <Route path="/live-scores" element={<LiveScores />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/transfers" element={<TransferMarket />} />
        <Route path="/rumors" element={<Rumors />} />
        <Route path="/forum" element={<Posts />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignPage />} />
        <Route path="/fixtures" element={<Fixtures />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/match-details/:fixtureId" element={<MatchDetails />} /> 
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;