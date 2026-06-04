import cors from "cors";
import "dotenv/config";
import express from "express";

import { voituresRouter } from "./router/voitures";

const app = express();
app.use(cors());
app.use(express.json());

const apiRouter = express.Router();
apiRouter.use('/voitures', voituresRouter);

app.use("/", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`voiture api listening on port ${process.env.PORT}!`)
});
