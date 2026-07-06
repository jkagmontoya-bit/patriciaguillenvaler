import React from 'react'; // Cache bust Vercel
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import SustainabilityPage from './pages/SustainabilityPage';
import ProfileCard from './components/ProfileCard';

const Home = () => (
  <>
    <ProfileCard />
    <Hero />
    <Contact />
  </>
);

function App() {
  return (
    <AuthProvider>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/acerca-de" element={<AboutPage />} />
          <Route path="/trazabilidad-y-sostenibilidad" element={<SustainabilityPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  );
}

export default App;
