import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";  // Import Navbar
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import SignPage from "./components/SignPage";
import LiveScores from "./pages/LiveScores";
import Standings from "./pages/Standings";
import TransferMarket from "./pages/TransferMarket";
import Rumors from "./pages/Rumors";
import CommunityForum from "./pages/CommunityForum";
import MatchDetails from "./pages/MatchDetails"; // Import the new MatchDetails component

function App() {
  return (
    <Router>
      <Navbar /> {/* Add the Navbar here */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />  {/* ✅ Homepage as Default */}
        <Route path="/live-scores" element={<LiveScores />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/transfers" element={<TransferMarket />} />
        <Route path="/rumors" element={<Rumors />} />
        <Route path="/forum" element={<CommunityForum />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignPage />} />
        <Route path="/match-details/:fixtureId" element={<MatchDetails />} /> {/* Add route for match details */}
      </Routes>
    </Router>
  );
}

export default App;