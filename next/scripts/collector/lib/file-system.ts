import { promises as fs } from "node:fs";
import path from "node:path";

export interface FileReader {
  listMarkdownFiles(dir: string): Promise<string[]>;
  readText(filePath: string): Promise<string>;
  exists(filePath: string): Promise<boolean>;
}

export interface FileSystem extends FileReader {
  ensureDir(dir: string): Promise<void>;
  writeText(filePath: string, content: string): Promise<void>;
}

export class DefaultFileSystem implements FileSystem {
  async listMarkdownFiles(dir: string): Promise<string[]> {
    if (!(await this.exists(dir))) {
      return [];
    }
    const result: string[] = [];
    await this.walk(dir, result);
    return result.sort();
  }

  async readText(filePath: string): Promise<string> {
    return fs.readFile(filePath, "utf8");
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async ensureDir(dir: string): Promise<void> {
    await fs.mkdir(dir, { recursive: true });
  }

  async writeText(filePath: string, content: string): Promise<void> {
    await this.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, "utf8");
  }

  private async walk(dir: string, accumulator: string[]): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await this.walk(full, accumulator);
        continue;
      }
      if (entry.isFile() && entry.name.endsWith(".md")) {
        accumulator.push(full);
      }
    }
  }
}

export const defaultFileSystem: FileSystem = new DefaultFileSystem();
