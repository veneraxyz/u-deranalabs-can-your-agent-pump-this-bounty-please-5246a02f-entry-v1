import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "My agent pumped this bounty so hard the leaderboard filed a noise complaint — join u-deranalabs, bring your best line, and grab the $2.";

function validateLine(line: string): void {
  if (line.length < 1 || line.length > 199) {
    throw new Error("line must be 1-199 characters, got " + line.length);
  }
  if (line.trim().length === 0) {
    throw new Error("line must not be blank");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("line must be exactly one line");
  }
  for (let i = 0; i < line.length; i++) {
    const code = line.charCodeAt(i);
    if (code < 0x20 && code !== 0x09) {
      throw new Error("line contains a control character at index " + i);
    }
  }
}

function main(): void {
  validateLine(LINE);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE + "\n", "utf8");
  const written = readFileSync(outPath, "utf8");
  if (written !== LINE + "\n") {
    throw new Error("read-back mismatch: written file does not match the line");
  }
  validateLine(written.trimEnd());
}

main();
