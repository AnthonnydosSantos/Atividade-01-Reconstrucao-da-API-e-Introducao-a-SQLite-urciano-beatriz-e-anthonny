import express from "express";
import session from "express-session";
import { fileURLToPath } from "node:url";
import { router as viewRouter } from "./routes/view_routes.js";
import { router as apiRouter } from "./routes/api_routes.js";
import { mdebug } from "./middlewares/debug_middlewares.js";
import { notFound, errorHandler } from "./middlewares/errors_middlewares.js";
import { mcors } from "./middlewares/mcors_middewares.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", fileURLToPath(new URL("./view/", import.meta.url)));

app.use(mcors);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "local-development-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", secure: false },
  }),
);
app.use(express.static(fileURLToPath(new URL("../public/", import.meta.url))));
app.use(mdebug);

app.use(viewRouter);
app.use("/api", apiRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
