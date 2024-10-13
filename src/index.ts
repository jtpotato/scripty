#! /usr/bin/env node

import { program } from "commander";
import { readFile } from "fs/promises";
import { title } from "process";
import chalk from "chalk";
import Script from "./Script.js";

program
  .name("scripty")
  .description("A CLI to display video scripts. Made by jtpotato")
  .version("1.0.0");

// Declare arguments/options
program.argument("<file>", "The file to process");

program.action(async (file: string) => {
  // open the file
  const data = await readFile(file, "utf8");
  const lines = data.split("\n");

  let script: Script = {
    title: "",
    shots: [],
    music: [],
    lines: [],
  };

  // parse the file
  lines.forEach((line) => {
    if (line.trim() === "") {
      return;
    }
    if (line.toLowerCase().startsWith("title:")) {
      script.title = line.slice(6).trim();
      return;
    }
    if (line.toLowerCase().startsWith("shot:")) {
      script.shots.push(line.slice(5).trim());
      script.lines.push(
        chalk.bold.green(line.slice(0, 5).toLocaleUpperCase()) + line.slice(5)
      );
      return;
    }
    if (line.toLowerCase().startsWith("music:")) {
      script.music.push(line.slice(6).trim());
      script.lines.push(
        chalk.bold.yellow(line.slice(0, 6).toLocaleUpperCase()) + line.slice(6)
      );
      return;
    }

    script.lines.push("\n" + line.trim());
  });

  // pretty print
  console.log(chalk.bold.red(script.title.toLocaleUpperCase()));
  console.log(chalk.blue("Shots:"));
  script.shots.forEach((shot) => console.log("- " + shot));
  console.log("");
  console.log(chalk.blue("Music:"));
  script.music.forEach((music) => console.log("- " + music));
  console.log("");
  console.log(chalk.blue("Lines:"));
  script.lines.forEach((line) => console.log(line));
});

program.parse();
