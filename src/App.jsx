import React from 'react'; // Cache bust Vercel
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard';

const Home = () => (
  <>
    <Hero />
    <Products />
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
