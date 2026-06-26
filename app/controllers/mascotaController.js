import inquirer from "inquirer";
import chalk from "chalk";
import Database from "../db/database.js";
import { pause } from "../helpers/helper.js";

export default class MascotaController {
  constructor() {
    this.db = new Database("./app/db/mascotas.json");
  }

  async menu() {
    console.clear();
    console.log(chalk.bgCyan.white("🐶 MASCOTAS"));

    const res = await inquirer.prompt([
      {
        type: "list",
        name: "op",
        choices: [
          { name: "Ver", value: 1 },
          { name: "Crear", value: 2 },
          { name: "Editar", value: 3 },
          { name: "Eliminar", value: 4 },
          { name: "Salir", value: 0 }
        ]
      }
    ]);

    return res.op;
  }

  async create() {
    const data = await inquirer.prompt([
      { name: "nombre" },
      { name: "especie" },
      { name: "edad" },
      { name: "propietario" }
    ]);

    const list = this.db.read();

    list.push({
      id: Date.now(),
      ...data
    });

    this.db.write(list);

    console.log(chalk.green("Mascota creada"));
    await pause();
  }

  async read() {
    console.table(this.db.read());
    await pause();
  }

  async update() {
    const list = this.db.read();

    const { id } = await inquirer.prompt([{ name: "id" }]);

    const index = list.findIndex(m => m.id == id);

    if (index === -1) {
      console.log("No existe");
      return await pause();
    }

    const data = await inquirer.prompt([
      { name: "nombre" },
      { name: "especie" },
      { name: "edad" },
      { name: "propietario" }
    ]);

    list[index] = { id: Number(id), ...data };

    this.db.write(list);

    console.log("Actualizado");
    await pause();
  }

  async delete() {
    const list = this.db.read();

    const { id } = await inquirer.prompt([{ name: "id" }]);

    this.db.write(list.filter(m => m.id != id));

    console.log("Eliminado");
    await pause();
  }

  async init() {
    let op;

    do {
      op = await this.menu();

      if (op === 1) await this.read();
      if (op === 2) await this.create();
      if (op === 3) await this.update();
      if (op === 4) await this.delete();

    } while (op !== 0);
  }
}