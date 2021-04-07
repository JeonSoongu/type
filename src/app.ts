import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import * as cors from "cors";
import * as morgan from "morgan";
import logger from "./config/logger";

const app = express();
dotenv.config();

app.set("view engine", "ejs");

app.use(express.static(`${__dirname}/src/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(morgan("tiny", { stream: { write: (message) => logger.info(message) } }));

import view from "./apis/view/index";
import boards from "./apis/boards";

app.use("/", view);
app.use("/api/boards", boards);

export default app;
