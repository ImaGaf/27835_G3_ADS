export class Estudiante {
  constructor(id, nombres, edad) {
    this.id = id;
    this.nombres = nombres;
    this.edad = edad;
  }

  static crear({ id, nombres, edad }) {
    if (!id || !nombres || edad <= 0) {
      throw new Error("Datos inválidos para crear un Estudiante");
    }
    return new Estudiante(id, nombres, edad);
  }
}
