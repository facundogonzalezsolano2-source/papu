import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const formRegistro = document.getElementById("registroForm");
const mensajeEstado = document.getElementById("mensajeEstado");

function mostrarMensaje(texto, tipo = "info") {
  if (!mensajeEstado) return;

  mensajeEstado.textContent = texto;
  mensajeEstado.className = "mensaje";
  mensajeEstado.classList.add(tipo);
}

if (formRegistro) {
  formRegistro.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const contrasena = document.getElementById("contrasena").value;
    const cbu = document.getElementById("cbu").value.trim();
    const alias = document.getElementById("alias").value.trim();
    const titularCuenta = document.getElementById("titularCuenta").value.trim();

    const submitButton = formRegistro.querySelector("button[type='submit']");
    const textoOriginalBoton = submitButton?.textContent || "Registrarse";

    try {
      // Estado visual para evitar envíos duplicados.
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Registrando...";
      }
      mostrarMensaje("Procesando registro...", "info");

      // 1) Crear usuario en Firebase Authentication.
      const credenciales = await createUserWithEmailAndPassword(auth, correo, contrasena);
      const uid = credenciales.user.uid;

      // 2) Guardar datos del usuario y cuenta bancaria en Firestore.
      await setDoc(doc(db, "users", uid), {
        nombre,
        correo,
        cbu,
        alias,
        titularCuenta,
        creadoEn: serverTimestamp()
      });

      mostrarMensaje("Registro exitoso. Tu cuenta fue creada correctamente.", "ok");
      formRegistro.reset();
    } catch (error) {
      console.error("Error al registrar usuario:", error);

      let detalle = "No se pudo completar el registro.";
      if (error.code === "auth/email-already-in-use") {
        detalle = "El correo ya está en uso.";
      } else if (error.code === "auth/invalid-email") {
        detalle = "El correo ingresado no es válido.";
      } else if (error.code === "auth/weak-password") {
        detalle = "La contraseña debe tener al menos 6 caracteres.";
      }

      mostrarMensaje(`Error: ${detalle}`, "error");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = textoOriginalBoton;
      }
    }
  });
} else {
  console.warn("No se encontró el formulario con id 'registroForm'.");
}
