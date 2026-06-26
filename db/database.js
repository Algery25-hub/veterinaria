import fs from "fs";

export default class Database {
  constructor(file) {
    this.file = file;
  }

  read() {
    if (!fs.existsSync(this.file)) {
      fs.writeFileSync(this.file, "[]");
      return [];
    }

    const data = fs.readFileSync(this.file, "utf-8");
    return JSON.parse(data || "[]");
  }

  write(data) {
    fs.writeFileSync(this.file, JSON.stringify(data, null, 2));
  }
}