import { Estudiante } from "../datos/model/Estudiante.js";
import { EstudianteRepository } from "../datos/repository/EstudianteRepository.js";

export class EstudianteService {
  constructor() {
    this.repository = EstudianteRepository.getInstance();
  }

  crearEstudiante(datos) {
    const est = Estudiante.crear(datos);

    if (this.repository.buscarPorId(est.id)) {
      throw new Error("El ID ya existe");
    }

    this.repository.agregar(est);
    return est;
  }

  editarEstudiante(id, nuevosDatos) {
    if (!this.repository.buscarPorId(id)) {
      throw new Error("Estudiante no encontrado");
    }

    return this.repository.editar(id, nuevosDatos);
  }

  eliminarEstudiante(id) {
    if (!this.repository.buscarPorId(id)) {
      throw new Error("Estudiante no encontrado");
    }

    return this.repository.eliminar(id);
  }

  listarEstudiantes() {
    return this.repository.listar();
  }
}
