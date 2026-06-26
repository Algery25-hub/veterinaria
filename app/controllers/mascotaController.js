import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";
import { pause } from "../helpers/helper.js";

const path = "./db/mascotas.json";
const propietarioPath = "./db/propietarios.json";

export default class MascotaController {

  readDB() {
    if (!fs.existsSync(path)) return [];
    const data = fs.readFileSync(path, "utf8");
    return JSON.parse(data || "[]");
  }

  readPropietarios() {
    if (!fs.existsSync(propietarioPath)) return [];
    const data = fs.readFileSync(propietarioPath, "utf8");
    return JSON.parse(data || "[]");
  }

  saveDB(data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
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
    const propietarios = this.readPropietarios();

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
        message: "Seleccione un propietario:",
        choices: propietarios.map(p => ({
          name: `${p.nombre} - ${p.telefono}`,
          value: p.id
        }))
      }
    ]);

    const propietario = propietarios.find(
      p => p.id === data.propietarioId
    );

    const list = this.readDB();

    list.push({
      id: Date.now(),
      nombre: data.nombre,
      especie: data.especie,
      edad: data.edad,
      propietarioId: propietario.id,
      propietario: propietario.nombre
    });

    this.saveDB(list);

    console.log(chalk.green("✅ Mascota creada correctamente."));
    await pause();
  }

  async read() {
    const list = this.readDB();

    if (list.length === 0) {
      console.log(chalk.yellow("No hay mascotas registradas."));
    } else {
      console.table(list);
    }

    await pause();
  }

  async update() {
    const list = this.readDB();

    if (list.length === 0) {
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

    const index = list.findIndex(m => m.id == id);

    if (index === -1) {
      console.log(chalk.red("La mascota no existe."));
      return await pause();
    }

    const propietarios = this.readPropietarios();

    const data = await inquirer.prompt([
      {
        type: "input",
        name: "nombre",
        message: "Nuevo nombre:",
        default: list[index].nombre
      },
      {
        type: "input",
        name: "especie",
        message: "Nueva especie:",
        default: list[index].especie
      },
      {
        type: "number",
        name: "edad",
        message: "Nueva edad:",
        default: list[index].edad
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

    list[index] = {
      id: Number(id),
      nombre: data.nombre,
      especie: data.especie,
      edad: data.edad,
      propietarioId: propietario.id,
      propietario: propietario.nombre
    };

    this.saveDB(list);

    console.log(chalk.green("✅ Mascota actualizada."));
    await pause();
  }

  async delete() {
    const list = this.readDB();

    if (list.length === 0) {
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

    const newList = list.filter(m => m.id != id);

    this.saveDB(newList);

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