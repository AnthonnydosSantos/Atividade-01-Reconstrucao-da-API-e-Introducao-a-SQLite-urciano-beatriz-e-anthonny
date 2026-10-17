import { Router } from "express";
import ApiController from "../controller/api_controllers.js";
import verifyParamId from "../middlewares/verify_id_middlewares.js";

const router = Router();
const controller = new ApiController();

router.get("/info", (req, res) => controller.getInfo(req, res));

router.get("/info/:id", verifyParamId, (req, res, next) =>
  controller.getInfoByParamId(req, res, next),
);

export { router };
