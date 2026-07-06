import React, { useEffect } from 'react';
import './Pages.css';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="generic-page">
      <h1>Acerca de</h1>
      
      <div className="generic-content">
        <p className="lead-text" style={{fontSize: '1.25rem', color: '#d3b06d', textAlign: 'center', marginBottom: '50px'}}>
          Patricia Guillén Valer | Estética & Skin Care es un estudio especializado en el cuidado facial y el bienestar personal. No es una clínica, ni un salón de belleza tradicional. Es un espacio construido con dedicación, cercanía y profesionalismo, donde cada persona recibe una experiencia pensada exclusivamente para sus necesidades.
        </p>

        <h2>Sobre Mí</h2>
        <p>
          He creado este estudio con el propósito de acompañar a las personas en el cuidado consciente de su piel. Creo firmemente que cada piel es única y merece una atención personalizada, basada en la escucha, la confianza y el respeto por sus necesidades individuales.
        </p>
        <p>
          Mi compromiso es ofrecer una experiencia cercana, profesional y humana, permitiendo que cada persona encuentre un espacio donde pueda sentirse cómoda, segura y acompañada. Este proyecto representa un sueño construido con dedicación y cariño, pensando siempre en brindar una atención responsable y enfocada en el bienestar integral.
        </p>

        <h2>Nuestra Filosofía</h2>
        <blockquote style={{borderLeft: '4px solid #d3b06d', paddingLeft: '20px', margin: '30px 0', fontStyle: 'italic', color: '#fff'}}>
          "No se trata únicamente de realizar un tratamiento, sino de construir hábitos de cuidado que puedan mantenerse en el tiempo y generar bienestar real."
        </blockquote>
        <p>
          Cada visita comienza con escucha. Cada protocolo se realiza con total respeto por los tiempos de tu piel. Nuestro propósito es construir relaciones duraderas basadas en la confianza y el acompañamiento profesional.
        </p>

        <h2>Nuestra Identidad</h2>
        <div className="grid-features">
          <div>
            <h4 style={{color: '#d3b06d'}}>Cercanía</h4>
            <p>Trato humano y personalizado. Cada persona es única.</p>
          </div>
          <div>
            <h4 style={{color: '#d3b06d'}}>Elegancia</h4>
            <p>Ambiente y experiencia pensados para tu total comodidad.</p>
          </div>
          <div>
            <h4 style={{color: '#d3b06d'}}>Bienestar</h4>
            <p>Más allá de la estética; cuidamos tu bienestar integral.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
