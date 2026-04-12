import dotenv from "dotenv";
dotenv.config();
import loaders from "./loaders";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { UserRoutes, CarrierRoutes, CustomerRoutes, DockRoutes } from "./api-routes";

loaders();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
  }),
);

const apiRouter = express.Router();
apiRouter.use("/users", UserRoutes);
apiRouter.use("/carriers", CarrierRoutes);
apiRouter.use("/customers", CustomerRoutes);
apiRouter.use("/docks", DockRoutes);
app.use("/api", apiRouter);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

apiRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const error = new Error("There is no such a path") as any;
  error.status = 404;
  next(error);
});
