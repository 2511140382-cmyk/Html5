
const banner = document.getElementById("estado-conexion");
const textoEstado = document.getElementById("estado-texto");
const btnEnviar = document.getElementById("btn-enviar");
const aviso = document.getElementById("aviso");
let temporizadorOculto;
let estadoActual = null; 
 

function mostrarEstado(enLinea) {
  if (enLinea === estadoActual) return; 
  estadoActual = enLinea;
 
  clearTimeout(temporizadorOculto);
  banner.classList.remove("oculto", "online", "offline");
 
  if (enLinea) {
    banner.classList.add("online");
    textoEstado.textContent = "CONECTADO";
    btnEnviar.disabled = false;
    
    temporizadorOculto = setTimeout(() => banner.classList.add("oculto"), 3000);
  } else {
    banner.classList.add("offline");
    textoEstado.textContent = "SIN WIFI";
    btnEnviar.disabled = true;
  }
}
 

async function verificarConexion() {
  if (!navigator.onLine) return mostrarEstado(false);
 
  const controlador = new AbortController();
  const limite = setTimeout(() => controlador.abort(), 4000);
 
  try {
    await fetch("https://www.gstatic.com/generate_204?t=" + Date.now(), {
      mode: "no-cors",
      cache: "no-store",
      signal: controlador.signal,
    });
    mostrarEstado(true);
  } catch (error) {
    mostrarEstado(false);
  } finally {
    clearTimeout(limite);
  }
}
 
window.addEventListener("online", verificarConexion);
window.addEventListener("offline", () => mostrarEstado(false));
 

verificarConexion();
setInterval(verificarConexion, 3000);
 

const PUBLIC_KEY = "xOyWJ6A5V1s1CpTrT";
const SERVICE_ID = "service_g63izj4";
const TEMPLATE_ID = "template_cd6qbs6";
 

if (typeof emailjs !== "undefined") {
  emailjs.init({ publicKey: PUBLIC_KEY });
}
 

function mostrarAviso(texto, tipo) {
  aviso.textContent = texto;
  aviso.className = "aviso " + tipo;
  aviso.hidden = false;
}
 

function enviarCorreo(e) {
  e.preventDefault();
 
  if (estadoActual === false || !navigator.onLine) {
    mostrarAviso("No hay conexión a internet (SIN WIFI).", "error");
    return;
  }
 
  if (typeof emailjs === "undefined") {
    mostrarAviso("No se cargó EmailJS. Recarga la página con internet.", "error");
    return;
  }
 
  btnEnviar.disabled = true;
  btnEnviar.textContent = "Enviando...";
  aviso.hidden = true;
 
  const parametros = {
    nombre: document.getElementById("nombre").value,
    correo: document.getElementById("correo").value,
    mensaje: document.getElementById("mensaje").value,
  };
 
  emailjs
    .send(SERVICE_ID, TEMPLATE_ID, parametros)
    .then((respuesta) => {
      console.log("Correo enviado con éxito:", respuesta.status, respuesta.text);
      mostrarAviso("¡Mensaje enviado con éxito!", "ok");
      document.getElementById("contact-form").reset();
    })
    .catch((error) => {
      console.error("Error de envío:", error);
      mostrarAviso("Error al enviar el mensaje. Revisa tu conexión y el correo ingresado.", "error");
    })
    .finally(() => {
      btnEnviar.disabled = estadoActual === false;
      btnEnviar.textContent = "Enviar";
    });
}