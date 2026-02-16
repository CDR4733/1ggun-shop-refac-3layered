import express from "express";
import { requireRefreshToken } from "../middlewares/require-refresh-token.middleware.js";

import { signUpValidator } from "../middlewares/validators/sign-up.validator.js";
import { logInValidator } from "../middlewares/validators/log-in.validator.js";

import { AuthController } from "../controllers/auth.controller.js";

const authRouter = express.Router();
const authController = new AuthController();

/** 회원가입 API **/
authRouter.post("/sign-up", signUpValidator, authController.signUp);

/** 로그인 API **/
authRouter.post("/log-in", logInValidator, authController.logIn);

/** 로그아웃 API **/
authRouter.post("/log-out", requireRefreshToken, authController.logOut);

/** 토큰 재발급 API **/
authRouter.post("/re-token", requireRefreshToken, authController.reToken);

export { authRouter };
