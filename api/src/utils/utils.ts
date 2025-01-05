import { UAParser } from "ua-parser-js";
import type { Request } from "express";

export const getUserAgent = (req: Request) => {
  const parser = new UAParser(req.headers["user-agent"]).getResult();
  console.log(parser);

  return {
    browser: parser.browser.name || "unknown",
    os: parser.os.name || "unknown",
  };
};
