import { EstudianteService } from "../logica_negocio/EstudianteService.js";

export class EstudianteController {

  constructor(service) {
    this.service = service;
  }

  crearEstudiante(datos) {
    return this.service.crearEstudiante(datos);
  }

  obtenerTodos() {
    return this.service.listarEstudiantes();
  }

  eliminar(id) {
    return this.service.eliminarEstudiante(id);
  }

  editar(id, nuevosDatos) {
    return this.service.editarEstudiante(id, nuevosDatos);
  }
}
