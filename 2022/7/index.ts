import { readFileSync } from "fs";

class File {
  private size: number;
  name: string;
  constructor(name: string, size: number) {
    this.name = name;
    this.size = size;
  }
  public getSize = () => this.size;
}

class Directory {
  private files: File[] = [];
  private directories: Directory[] = [];
  private name: string;
  constructor(name: string) {
    this.name = name;
  }
  public getSize = (): number =>
    this.files.reduce<number>((sum, file) => sum + file.getSize(), 0) +
    this.directories.reduce<number>((sum, dirs) => sum + dirs.getSize(), 0);

  public addFile = (file: File) => {
    if (this.files.find((f) => f.name === file.name)) return;
    this.files.push(file);
  };
  public addDirectory = (dir: Directory) => {
    if (this.directories.find((d) => d.name === dir.name)) return;
    this.directories.push(dir);
  };
  public getDirectory = (name: string) =>
    this.directories.find((d) => d.name === name);
  public getDirectories = () => this.directories;
}

type Cd = (relativePath?: string, absolutePath?: string) => void;
type MkDir = (name: string) => void;
type Touch = (name: string, size: number) => void;

class Terminal {
  private directoryTree: Directory = new Directory("/");
  private workingDirectory = ["/"];
  private cd: Cd = (relativePath?: string, absolutePath?: string): void => {
    if (absolutePath) {
      this.workingDirectory = ["/", ...absolutePath.split("/")];
      return;
    }
    if (relativePath === "..") {
      this.workingDirectory.pop();
      return;
    }
    this.workingDirectory.push(relativePath ?? "");
  };

  private mkdir: MkDir = (name: string): void => {
    const currentDirectory = this.getCurrentDirectory();
    currentDirectory.addDirectory(new Directory(name));
  };

  private touch: Touch = (name: string, size: number): void => {
    const currentDirectory = this.getCurrentDirectory();
    currentDirectory.addFile(new File(name, size));
  };

  private getCurrentDirectory = () =>
    this.workingDirectory.reduce<Directory>((directory, directoryName) => {
      return directory.getDirectory(directoryName) ?? this.directoryTree;
    }, this.directoryTree);

  public runCommand = (command: Command) =>
    command.execute(this.cd, this.mkdir, this.touch);

  public getCombinedSizeOfAllDirectoriesFulfillingSizeCriteria = () => {
    const SIZE_CRITERIA = 100000;
    const sizes: number[] = [];
    const getSize = (dir: Directory) => {
      sizes.push(dir.getSize());
      dir.getDirectories().forEach(getSize);
    };
    return sizes
      .filter((s) => s <= SIZE_CRITERIA)
      .reduce<number>((sum, size) => sum + size, 0);
  };
}

interface Command {
  argument: string;
  output: string[];
  execute: (cd: Cd, mkdir: MkDir, touch: Touch) => void;
  addOutput: (output: string) => void;
}

class CdCommand implements Command {
  argument: string;
  output: string[] = [];
  constructor(argument: string) {
    this.argument = argument;
  }
  static canHandle = (rawCommand: string) => rawCommand.includes("$ cd ");
  addOutput = (output: string) => this.output.push(output);
  execute = (cd: Cd, mkdir: MkDir, touch: Touch) => {
    this.argument === "/"
      ? cd(undefined, this.argument)
      : cd(this.argument, undefined);
  };
}

class LsCommand implements Command {
  private static DIRECTORY_IDENTIFIER = "dir";
  argument: string = "";
  output: string[] = [];
  static canHandle = (rawCommand: string) => rawCommand.includes("$ ls");
  addOutput = (output: string) => this.output.push(output);
  execute = (_cd: Cd, mkdir: MkDir, touch: Touch) => {
    this.output.forEach((o) => {
      const [dirIdentifierOrFileSize, fileOrDirectoryName] = o.split(" ");
      if (dirIdentifierOrFileSize === LsCommand.DIRECTORY_IDENTIFIER) {
        mkdir(fileOrDirectoryName);
        return;
      }
      touch(fileOrDirectoryName, +dirIdentifierOrFileSize);
    });
  };
}

class InputParser {
  private static INPUT_PREFIX = "$";
  public static ParseIntoCommands = (rawInput: string): Command[] => {
    const rows = rawInput.split("\r\n");
    return rows
      .reduce<Command[]>((commands, row) => {
        if (this.rowIsInput(row)) {
          if (CdCommand.canHandle(row))
            return [new CdCommand(row), ...commands];
          return [new LsCommand(), ...commands];
        }
        const [currentCommand, ..._rest] = commands;
        currentCommand.addOutput(row);
        return commands;
      }, [])
      .reverse();
  };
  public static rowIsInput = (row: string) => row.startsWith(this.INPUT_PREFIX);
}

const commands = InputParser.ParseIntoCommands(
  readFileSync("./input", "utf-8")
);

const terminal = new Terminal();
commands.forEach(terminal.runCommand);
console.log(
  "Answer #1: ",
  terminal.getCombinedSizeOfAllDirectoriesFulfillingSizeCriteria()
);
