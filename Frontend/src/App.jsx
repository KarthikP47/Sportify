import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";  // Import Navbar
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import SignPage from "./components/SignPage";
import LiveScores from "./pages/LiveScores/LiveScores";
import Standings from "./pages/Standings/Standings";
import TransferMarket from "./pages/TransferMarket";
import Rumors from "./pages/Rumors";
import CommunityForum from "./pages/CommunityForum";
import MatchDetails from "./pages/MatchDetails/MatchDetails";
import Fixtures from "./pages/Fixtures/Fixtures"
import Posts from "./pages/Posts/Posts";
import { isAuthenticated, removeToken } from "../utils/auth";

function App() {
  return (
    <Router>
      <Navbar /> {/* Add the Navbar here */}
      <nav>
        {isAuthenticated() ? (
          <>
            <button onClick={() => { removeToken(); window.location.href = '/'; }}>Logout</button>
          </>
        ) : null}
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />  {/* ✅ Homepage as Default */}
        <Route path="/live-scores" element={<LiveScores />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/transfers" element={<TransferMarket />} />
        <Route path="/rumors" element={<Rumors />} />
        <Route path="/forum" element={<Posts />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignPage />} />
        <Route path="/fixtures" element={<Fixtures />} />
        <Route path="/match-details/:fixtureId" element={<MatchDetails />} /> {/* Add route for match details */}
      </Routes>
    </Router>
  );
}

export default App;