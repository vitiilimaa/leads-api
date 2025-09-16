import express from "express";
import cors from "cors";
import { router } from "./router";
import { errorMiddleware } from "./middlewares/error-middleware";

const app = express();

app.use(cors());
app.use(express.json())

app.use("/api", router);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor iniciado em http://localhost:${PORT}`)
);
