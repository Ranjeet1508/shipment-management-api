import dotenv from "dotenv";
dotenv.config();
import loaders from "./loaders";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { UserRoutes, CarrierRoutes, CustomerRoutes, DockRoutes, ShipmentRoutes } from "./api-routes";
import hpp from 'hpp';
import rateLimit from "express-rate-limit";
loaders();

const app = express();

app.use(express.json({
  limit: '1mb',
  strict: true,
  type: 'application/json'
}));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));1

app.use(rateLimit({
  windowMs: 1 * 60 * 1000,        //1 minute
  limit: 50,
  standardHeaders: false,
  message: "Too many request"
}))
app.use(hpp());
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
apiRouter.use("/shipments", ShipmentRoutes);
app.use("/api", apiRouter);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

apiRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const error = new Error("There is no such a path") as any;
  error.status = 404;
  next(error);
});
