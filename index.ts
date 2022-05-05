import express from "express";
import path from "path";
import cors from "cors";
import apiKeskustelutRouter from "./routes/apiKeskustelut";

const app: express.Application = express();

app.use(express.json());

const portti: number = Number(process.env.PORT) || 3107;

app.use(express.static(path.resolve(__dirname, "public")));

app.use(cors({ origin: "http://localhost:3000" }));

app.use("/api/keskustelut", apiKeskustelutRouter);

app.listen(portti, () => {
  console.log(`Palvelin käynnissä portissa: ${portti}`);
});
