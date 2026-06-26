import inquirer from "inquirer";
import MascotaController from "./app/controllers/mascotaController.js";
import PropietarioController from "./app/controllers/propietarioController.js";

async function menu() {
  const res = await inquirer.prompt([
    {
      type: "list",
      name: "op",
      choices: [
        { name: "Mascotas", value: 1 },
        { name: "Propietarios", value: 2 },
        { name: "Salir", value: 0 }
      ]
    }
  ]);

  return res.op;
}

async function run(op) {
  if (op === 1) {
    const m = new MascotaController();
    await m.init();
  }

  if (op === 2) {
    const p = new PropietarioController();
    await p.init();
  }
}

let op;

do {
  console.clear();
  op = await menu();
  await run(op);
} while (op !== 0);