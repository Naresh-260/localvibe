import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { MapProvider } from "./context/MapContext.jsx";
import Navbar from "./components/UI/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import EventDetailPage from "./pages/EventDetailPage.jsx";
import CreateEventPage from "./pages/CreateEventPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MapProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/create-event" element={<CreateEventPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </MapProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;