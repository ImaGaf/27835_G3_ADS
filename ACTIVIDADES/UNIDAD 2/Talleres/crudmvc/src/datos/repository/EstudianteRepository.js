export class EstudianteRepository {
  constructor() {
    
    if (EstudianteRepository.instance) {
      return EstudianteRepository.instance;
    }
        
    this.estudiantes = [];
    EstudianteRepository.instance = this;
  }
  static getInstance() {
    if (!EstudianteRepository.instance) {
      EstudianteRepository.instance = new EstudianteRepository();
    }
    return EstudianteRepository.instance;
  }
  agregar(estudiante) {
    this.estudiantes.push(estudiante);
  }

  editar(id, nuevosDatos) {
    const index = this.estudiantes.findIndex(e => e.id === id);
    if (index === -1) return false;
    this.estudiantes[index] = { ...this.estudiantes[index], ...nuevosDatos };
    return true;
  }

  eliminar(id) {
      const originalLength = this.estudiantes.length;
      this.estudiantes = this.estudiantes.filter(e => e.id !== id);
    return this.estudiantes.length < originalLength;
  }

  listar() {
    return this.estudiantes;
  }

  buscarPorId(id) {
    return this.estudiantes.find(e => e.id === id);
  }
}
