import { EstudianteRepository } from "../datos/repository/EstudianteRepository.js";
import { EstudianteService } from "../logica_negocio/EstudianteService.js";
import { EstudianteController } from "../controller/EstudianteController.js";

export class EstudianteUI {

  constructor() {

    const repo = EstudianteRepository.getInstance();
    const service = new EstudianteService(repo);
    this.controller = new EstudianteController(service);

    this.btnGuardar = document.getElementById("btnGuardar");
    this.table = document.getElementById("tablaEstudiantes");

    this.modo = "crear";
    this.idEditando = null;

    this.btnGuardar.addEventListener("click", () => this.guardar());

    this.mostrarTabla();
  }

  guardar() {
    const id = document.getElementById("txtId").value;
    const nombres = document.getElementById("txtNombres").value;
    const edad = parseInt(document.getElementById("txtEdad").value);

    try {
      if (this.modo === "crear") {
        this.controller.crearEstudiante({ id, nombres, edad });
        alert("Estudiante agregado correctamente");
      }

      if (this.modo === "editar") {
        this.controller.editar(this.idEditando, { nombres, edad });
        alert("Estudiante actualizado");

        this.modo = "crear";
        this.btnGuardar.textContent = "Guardar";
        document.getElementById("txtId").disabled = false;
      }

      this.limpiarCampos();
      this.mostrarTabla();

    } catch (e) {
      alert(e.message);
    }
  }

  cargarParaEditar(id) {
    const lista = this.controller.obtenerTodos();
    const est = lista.find(e => e.id === id);

    document.getElementById("txtId").value = est.id;
    document.getElementById("txtNombres").value = est.nombres;
    document.getElementById("txtEdad").value = est.edad;

    document.getElementById("txtId").disabled = true;

    this.modo = "editar";
    this.idEditando = id;
    this.btnGuardar.textContent = "Actualizar";
  }

  eliminar(id) {
    if (confirm("¿Seguro que deseas eliminar este estudiante?")) {
      this.controller.eliminar(id);
      alert("Estudiante eliminado");
      this.mostrarTabla();
    }
  }

  mostrarTabla() {
    const lista = this.controller.obtenerTodos();

    this.table.innerHTML = `
      <tr>
        <th>ID</th>
        <th>Nombres</th>
        <th>Edad</th>
        <th>Acciones</th>
      </tr>
    `;

    lista.forEach(est => {
      this.table.innerHTML += `
        <tr>
          <td>${est.id}</td>
          <td>${est.nombres}</td>
          <td>${est.edad}</td>
          <td>
            <button onclick="ui.cargarParaEditar('${est.id}')">Editar</button>
            <button onclick="ui.eliminar('${est.id}')">Eliminar</button>
          </td>
        </tr>
      `;
    });
  }

  limpiarCampos() {
    document.getElementById("txtId").value = "";
    document.getElementById("txtNombres").value = "";
    document.getElementById("txtEdad").value = "";

    document.getElementById("txtId").disabled = false;
  }
}

window.ui = new EstudianteUI();
