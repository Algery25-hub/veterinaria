import inquirer from "inquirer";
import chalk from "chalk";
import Database from "../../db/database.js";
import { pause } from "../helpers/helper.js";

export default class MascotaController {
  constructor() {
    this.db = new Database("./db/mascotas.json");
    this.propietariosDB = new Database("./db/propietarios.json");
  }

  async menu() {
    console.clear();
    console.log(chalk.bgCyan.white(" 🐶 MASCOTAS "));

    const { op } = await inquirer.prompt([
      {
        type: "list",
        name: "op",
        message: "Seleccione una opción:",
        choices: [
          { name: "👀 Ver mascotas", value: 1 },
          { name: "➕ Crear mascota", value: 2 },
          { name: "✏️ Editar mascota", value: 3 },
          { name: "🗑️ Eliminar mascota", value: 4 },
          { name: "⬅️ Volver", value: 0 }
        ]
      }
    ]);

    return op;
  }

  async create() {
    const propietarios = this.propietariosDB.read();

    if (propietarios.length === 0) {
      console.log(chalk.red("No hay propietarios registrados."));
      return await pause();
    }

    const data = await inquirer.prompt([
      {
        type: "input",
        name: "nombre",
        message: "Nombre:"
      },
      {
        type: "input",
        name: "especie",
        message: "Especie:"
      },
      {
        type: "number",
        name: "edad",
        message: "Edad:"
      },
      {
        type: "list",
        name: "propietarioId",
        message: "Seleccione el propietario:",
        choices: propietarios.map(p => ({
          name: `${p.nombre} - ${p.telefono}`,
          value: p.id
        }))
      }
    ]);

    const propietario = propietarios.find(
      p => p.id === data.propietarioId
    );

    const mascotas = this.db.read();

    mascotas.push({
      id: Date.now(),
      nombre: data.nombre,
      especie: data.especie,
      edad: data.edad,
      propietarioId: propietario.id,
      propietario: propietario.nombre
    });

    this.db.write(mascotas);

    console.log(chalk.green("✅ Mascota creada correctamente."));
    await pause();
  }

  async read() {
    const mascotas = this.db.read();

    if (mascotas.length === 0) {
      console.log(chalk.yellow("No hay mascotas registradas."));
    } else {
      console.table(mascotas);
    }

    await pause();
  }

  async update() {
    const mascotas = this.db.read();

    if (mascotas.length === 0) {
      console.log(chalk.yellow("No hay mascotas registradas."));
      return await pause();
    }

    const { id } = await inquirer.prompt([
      {
        type: "input",
        name: "id",
        message: "ID de la mascota:"
      }
    ]);

    const index = mascotas.findIndex(m => m.id == id);

    if (index === -1) {
      console.log(chalk.red("La mascota no existe."));
      return await pause();
    }

    const propietarios = this.propietariosDB.read();

    const data = await inquirer.prompt([
      {
        type: "input",
        name: "nombre",
        message: "Nuevo nombre:",
        default: mascotas[index].nombre
      },
      {
        type: "input",
        name: "especie",
        message: "Nueva especie:",
        default: mascotas[index].especie
      },
      {
        type: "number",
        name: "edad",
        message: "Nueva edad:",
        default: mascotas[index].edad
      },
      {
        type: "list",
        name: "propietarioId",
        message: "Seleccione el propietario:",
        choices: propietarios.map(p => ({
          name: `${p.nombre} - ${p.telefono}`,
          value: p.id
        }))
      }
    ]);

    const propietario = propietarios.find(
      p => p.id === data.propietarioId
    );

    mascotas[index] = {
      id: Number(id),
      nombre: data.nombre,
      especie: data.especie,
      edad: data.edad,
      propietarioId: propietario.id,
      propietario: propietario.nombre
    };

    this.db.write(mascotas);

    console.log(chalk.green("✅ Mascota actualizada."));
    await pause();
  }

  async delete() {
    const mascotas = this.db.read();

    if (mascotas.length === 0) {
      console.log(chalk.yellow("No hay mascotas registradas."));
      return await pause();
    }

    const { id } = await inquirer.prompt([
      {
        type: "input",
        name: "id",
        message: "ID de la mascota a eliminar:"
      }
    ]);

    const nuevasMascotas = mascotas.filter(m => m.id != id);

    this.db.write(nuevasMascotas);

    console.log(chalk.green("✅ Mascota eliminada."));
    await pause();
  }

  async init() {
    let op;

    do {
      op = await this.menu();

      switch (op) {
        case 1:
          await this.read();
          break;
        case 2:
          await this.create();
          break;
        case 3:
          await this.update();
          break;
        case 4:
          await this.delete();
          break;
      }

    } while (op !== 0);
  }
}