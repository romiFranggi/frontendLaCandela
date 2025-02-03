import React, {useRef} from "react";
import { Footer, Navbar } from "../components";
import emailjs from '@emailjs/browser';
import toast from "react-hot-toast";
import "../css/contactPage.css";


const ContactPage = () => {
  const refForm = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();

    const serviceId = "service_25e7ujj";
    const templateId = "template_2h1cq5a";
    const apikey = "emxX7VUerELw595yb";

    emailjs.sendForm(serviceId, templateId, refForm.current, apikey)
    .then(result => console.log(result.text), toast.success("Mensaje enviado"))
    .catch(error => console.error(error))
  }

  return (
    <div className="contactPageDiv">
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Contactanos</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form ref = {refForm} action = "" onSubmit = {handleSubmit}>
              <div className="form my-3">
                <label htmlFor="Name">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  id="Name"
                  name = "Name"
                  placeholder="Ingresa tu nombre"
                />
              </div>
              <div className="form my-3">
                <label htmlFor="Email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="Email"
                  placeholder="nombre@ejemplo.com"
                  name = "email"
                />
              </div>
              <div className="form  my-3">
                <label htmlFor ="Password">Mensaje</label>
                <textarea
                  rows={5}
                  className="form-control"
                  id="Password"
                  placeholder="Escribe tu mensaje..."
                  name = "message"
                />
              </div>
              <div className="text-center">
                <button
                  className="my-2 px-4 mx-auto btn btn-dark"
                  type="submit"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
