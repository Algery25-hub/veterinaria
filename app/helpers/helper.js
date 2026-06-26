import inquirer from "inquirer";

export async function pause() {
  await inquirer.prompt([
    {
      type: "input",
      name: "p",
      message: "ENTER para continuar..."
    }
  ]);
}