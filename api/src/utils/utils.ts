import { UAParser } from "ua-parser-js";
import { request } from "express";

export const getUserAgent = () => {
  const parser = new UAParser(request.headers["user-agent"]).getResult();
  console.log("parser", parser);

  return {
    browser: parser.browser.name || "unknown",
    os: parser.os.name || "unknown",
  };
};
