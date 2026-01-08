import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import DaftarSaya from "./pages/DaftarSaya";
import Detail from "./pages/Detail";
import VideoPlayer from "./pages/VideoPlayer";
import ProfilSaya from "./pages/ProfilSaya";
import Premium from "./pages/Premium";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/daftar-saya" element={<DaftarSaya />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/video/:movieId" element={<VideoPlayer />} />
        <Route path="/video/:movieId/:episodeNo" element={<VideoPlayer />} />
        <Route path="/profil" element={<ProfilSaya />} />
        <Route path="/premium" element={<Premium />} />
      </Routes>
    </BrowserRouter>
  );
}