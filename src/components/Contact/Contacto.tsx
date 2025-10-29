import React, { useState } from "react";
import "./Contacto.css"; 
import { FaFacebookF, FaInstagram } from "react-icons/fa";


const Contacto: React.FC = () => {
  // Estado local del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    alert("Tu mensaje fue enviado correctamente ✅");
    setFormData({ nombre: "", email: "", asunto: "", mensaje: "" });
  };

  return (
    <section className="contacto-container">
      <div className="columna-form">
        <h2 className="contacto-titulo">COMUNICATE CON NOSOTROS</h2>
        <p className="contacto-descripcion">
          Ante cualquier consulta no dudes en comunicarte. Dejá tus datos y consulta utilizando el
          formulario a continuación y nos contactaremos a la brevedad.
        </p>

        <form className="form-contacto" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="asunto">Asunto</label>
            <input
              id="asunto"
              type="text"
              value={formData.asunto}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              rows={6}
              value={formData.mensaje}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn-enviar">
            ENVIAR
          </button>
        </form>
      </div>

      <div className="columna-redes">
        <h2 className="contacto-titulo">NUESTRAS REDES SOCIALES</h2>
        <div className="iconos-redes">
          <a href="#"><FaFacebookF />
            <i className="fab fa-facebook-f"></i>    
          </a>
           <a href="#"><FaInstagram />
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
