import inquirer from "inquirer";
import MascotaController from "./app/controllers/mascotaController.js";
import PropietarioController from "./app/controllers/propietarioController.js";

async function menu() {
  const { op } = await inquirer.prompt([
    {
      type: "list",
      name: "op",
      message: "Seleccione una opción:",
      choices: [
        { name: "Mascotas", value: 1 },
        { name: "Propietarios", value: 2 },
        { name: "Salir", value: 0 }
      ]
    }
  ]);

  return op;
}

async function run(op) {
  switch (op) {
    case 1:
      await new MascotaController().init();
      break;

    case 2:
      await new PropietarioController().init();
      break;
  }
}

let op;

do {
  console.clear();
  op = await menu();
  await run(op);
} while (op !== 0);