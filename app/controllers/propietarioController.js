import inquirer from "inquirer";
import chalk from "chalk";
import Database from "../../db/database.js";
import { pause } from "../helpers/helper.js";

export default class PropietarioController {
  constructor() {
    this.db = new Database("./db/propietarios.json");
  }

  async menu() {
    console.clear();
    console.log(chalk.bgMagenta.white(" 👤 PROPIETARIOS "));

    const { op } = await inquirer.prompt([
      {
        type: "list",
        name: "op",
        message: "Seleccione una opción:",
        choices: [
          { name: "👀 Ver propietarios", value: 1 },
          { name: "➕ Crear propietario", value: 2 },
          { name: "✏️ Editar propietario", value: 3 },
          { name: "🗑️ Eliminar propietario", value: 4 },
          { name: "⬅️ Volver", value: 0 }
        ]
      }
    ]);

    return op;
  }

  async create() {
    const data = await inquirer.prompt([
      {
        type: "input",
        name: "nombre",
        message: "Nombre:"
      },
      {
        type: "input",
        name: "telefono",
        message: "Teléfono:"
      }
    ]);

    const propietarios = this.db.read();

    propietarios.push({
      id: Date.now(),
      nombre: data.nombre,
      telefono: data.telefono
    });

    this.db.write(propietarios);

    console.log(chalk.green("✅ Propietario creado correctamente."));
    await pause();
  }

  async read() {
    const propietarios = this.db.read();

    if (propietarios.length === 0) {
      console.log(chalk.yellow("No hay propietarios registrados."));
    } else {
      console.table(propietarios);
    }

    await pause();
  }

  async update() {
    const propietarios = this.db.read();

    if (propietarios.length === 0) {
      console.log(chalk.yellow("No hay propietarios registrados."));
      return await pause();
    }

    const { id } = await inquirer.prompt([
      {
        type: "input",
        name: "id",
        message: "ID del propietario:"
      }
    ]);

    const index = propietarios.findIndex(p => p.id == id);

    if (index === -1) {
      console.log(chalk.red("El propietario no existe."));
      return await pause();
    }

    const data = await inquirer.prompt([
      {
        type: "input",
        name: "nombre",
        message: "Nuevo nombre:",
        default: propietarios[index].nombre
      },
      {
        type: "input",
        name: "telefono",
        message: "Nuevo teléfono:",
        default: propietarios[index].telefono
      }
    ]);

    propietarios[index] = {
      id: Number(id),
      nombre: data.nombre,
      telefono: data.telefono
    };

    this.db.write(propietarios);

    console.log(chalk.green("✅ Propietario actualizado."));
    await pause();
  }

  async delete() {
    const propietarios = this.db.read();

    if (propietarios.length === 0) {
      console.log(chalk.yellow("No hay propietarios registrados."));
      return await pause();
    }

    const { id } = await inquirer.prompt([
      {
        type: "input",
        name: "id",
        message: "ID del propietario a eliminar:"
      }
    ]);

    const nuevoListado = propietarios.filter(p => p.id != id);

    this.db.write(nuevoListado);

    console.log(chalk.green("✅ Propietario eliminado."));
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