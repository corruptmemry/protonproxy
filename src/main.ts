import { createProxy } from "@modules/createProxy";
import * as log from "@modules/log";

export const delayMillis = (delayMs: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, delayMs));

export const main = async (): Promise<boolean> => {
  log.info("Starting up...");
  createProxy();
  process.on("SIGINT", function () {
    log.info("Exit");
    process.exit();
  });
  return true;
};
