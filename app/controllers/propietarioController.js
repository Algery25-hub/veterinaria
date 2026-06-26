import inquirer from "inquirer";
import chalk from "chalk";
import Database from "../db/database.js";
import { pause } from "../helpers/helper.js";

<<<<<<< HEAD
export default class PropietarioController {
  constructor() {
    this.db = new Database("./app/db/propietarios.json");
=======
const path = "./db/propietarios.json";

export default class PropietarioController {

  readDB() {
    if (!fs.existsSync(path)) return [];
    const data = fs.readFileSync(path, "utf8");
    return JSON.parse(data || "[]");
  }

  saveDB(data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
>>>>>>> feat/jared-crud
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

    const list = this.db.read();

    list.push({
      id: Date.now(),
      ...data
    });

    this.db.write(list);

    console.log(chalk.green("✅ Propietario creado."));
    await pause();
  }

  async read() {
<<<<<<< HEAD
    console.table(this.db.read());
=======
    const list = this.readDB();

    if (list.length === 0) {
      console.log(chalk.yellow("No hay propietarios registrados."));
    } else {
      console.table(list);
    }

>>>>>>> feat/jared-crud
    await pause();
  }

  async update() {
    const list = this.db.read();

    const { id } = await inquirer.prompt([
      {
        type: "input",
        name: "id",
        message: "ID del propietario:"
      }
    ]);

    const index = list.findIndex(p => p.id == id);

    if (index === -1) {
      console.log(chalk.red("Propietario no encontrado."));
      return await pause();
    }

    const data = await inquirer.prompt([
      {
        type: "input",
        name: "nombre",
        message: "Nuevo nombre:"
      },
      {
        type: "input",
        name: "telefono",
        message: "Nuevo teléfono:"
      }
    ]);

    list[index] = {
      id: Number(id),
      ...data
    };

    this.db.write(list);

    console.log(chalk.green("✅ Propietario actualizado."));
    await pause();
  }

  async delete() {
    const list = this.db.read();

    const { id } = await inquirer.prompt([
      {
        type: "input",
        name: "id",
        message: "ID del propietario a eliminar:"
      }
    ]);

    this.db.write(list.filter(p => p.id != id));

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