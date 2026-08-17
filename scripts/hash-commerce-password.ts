import { hash } from "bcryptjs";

async function readHidden(prompt: string) {
  if (!process.stdin.isTTY || !process.stdin.setRawMode) {
    throw new Error("Run this command in an interactive terminal.");
  }
  process.stdout.write(prompt);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  return new Promise<string>((resolve, reject) => {
    let value = "";
    const cleanup = () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write("\n");
    };
    process.stdin.on("data", function onData(chunk: string) {
      if (chunk === "\u0003") {
        cleanup();
        reject(new Error("Canceled."));
      } else if (chunk === "\r" || chunk === "\n") {
        process.stdin.off("data", onData);
        cleanup();
        resolve(value);
      } else if (chunk === "\u007f" || chunk === "\b") {
        value = value.slice(0, -1);
      } else if (/^[\x20-\x7E]+$/.test(chunk)) {
        value += chunk;
      }
    });
  });
}

const password = await readHidden("New commerce admin password (hidden): ");
if (password.length < 14) throw new Error("Use at least 14 characters.");
const confirmation = await readHidden("Confirm password (hidden): ");
if (password !== confirmation) throw new Error("Passwords did not match.");
console.log(await hash(password, 12));
