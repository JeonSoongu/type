import app from "../app";
import logger from "../config/logger";
import * as express from "express";
const PORT: number = Number(process.env.PORT) || 8080;
const application: express.Application = app;

application
  .listen(PORT, () => logger.info(`${PORT} 포트에서 서버가 가동되었습니다.`))
  .on("error", (err) => console.error(err));
