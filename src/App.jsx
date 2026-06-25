import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import ValueProposition from './components/ValueProposition';
import Products from './components/Products';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <ValueProposition />
        <Products />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
