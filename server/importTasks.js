import fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";
import { loadEnvFile } from "./env.js";

loadEnvFile();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/task_app";

const taskSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    resources: {
      course: String,
      video: String,
    },
  },
  { versionKey: false },
);

const Task = mongoose.model("Task", taskSchema);

await mongoose.connect(MONGODB_URI);

const rows = [];

fs.createReadStream("./tasks.csv")
  .pipe(csv())
  .on("data", (data) => rows.push(data))
  .on("end", async () => {
    const formattedTasks = rows.map((row) => ({
      _id: String(row.id).trim(),
      title: String(row.title || "").trim(),
      resources: {
        course: row.course || null,
        video: row.video || null,
      },
    }));

    await Task.deleteMany({});
    await Task.insertMany(formattedTasks);

    console.log(`Imported ${formattedTasks.length} tasks into MongoDB.`);
    process.exit(0);
  })
  .on("error", (error) => {
    console.error("Task import failed", error);
    process.exit(1);
  });
