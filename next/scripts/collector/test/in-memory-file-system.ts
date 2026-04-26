import path from "node:path";

import type { FileSystem } from "../lib/file-system";

export class InMemoryFileSystem implements FileSystem {
  readonly files = new Map<string, string>();

  async listMarkdownFiles(dir: string): Promise<string[]> {
    const prefix = dir.endsWith(path.sep) ? dir : `${dir}${path.sep}`;
    return Array.from(this.files.keys())
      .filter((p) => (p === dir || p.startsWith(prefix)) && p.endsWith(".md"))
      .sort();
  }

  async readText(filePath: string): Promise<string> {
    const value = this.files.get(filePath);
    if (value === undefined) {
      throw new Error(`ENOENT: ${filePath}`);
    }
    return value;
  }

  async exists(filePath: string): Promise<boolean> {
    return this.files.has(filePath);
  }

  async ensureDir(_dir: string): Promise<void> {
    void _dir;
  }

  async writeText(filePath: string, content: string): Promise<void> {
    this.files.set(filePath, content);
  }
}
