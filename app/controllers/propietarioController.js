import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";
import { pause } from "../helpers/helper.js";

const path = "./app/db/propietarios.json";

export default class PropietarioController {

  readDB() {
    if (!fs.existsSync(path)) return [];
    const data = fs.readFileSync(path, "utf-8");
    return JSON.parse(data || "[]");
  }

  saveDB(data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  }

  async menu() {
    console.clear();
    console.log(chalk.bgMagenta.white("👤 PROPIETARIOS"));

    const res = await inquirer.prompt([
      {
        type: "select",
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
      { name: "telefono" }
    ]);

    const list = this.readDB();

    list.push({ id: Date.now(), ...data });

    this.saveDB(list);

    console.log("Creado");
    await pause();
  }

  async read() {
    console.table(this.readDB());
    await pause();
  }

  async update() {
    const list = this.readDB();

    const { id } = await inquirer.prompt([{ name: "id" }]);

    const index = list.findIndex(p => p.id == id);

    if (index === -1) {
      console.log("No existe");
      return await pause();
    }

    const data = await inquirer.prompt([
      { name: "nombre" },
      { name: "telefono" }
    ]);

    list[index] = { id: Number(id), ...data };

    this.saveDB(list);

    console.log("Actualizado");
    await pause();
  }

  async delete() {
    const list = this.readDB();

    const { id } = await inquirer.prompt([{ name: "id" }]);

    const newList = list.filter(p => p.id != id);

    this.saveDB(newList);

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