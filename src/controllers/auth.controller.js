import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MESSAGES } from "../constants/message.constant.js";

import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

export class AuthController {
  /** 회원가입 API **/
  signUp = async (req, res, next) => {
    try {
      // 1. Request
      const { email, password, name } = req.body;
      // 2. Service
      const data = await authService.signUp({ email, password, name });
      // 3. Resopnse
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };

  /** 로그인 API **/
  logIn = async (req, res, next) => {
    try {
      // 1. Request
      const { email, password } = req.body;
      // 2. Service
      const data = await authService.logIn({ email, password });
      // 3. Response
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.LOG_IN.SUCCEED,
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };

  /** 로그아웃 API **/
  logOut = async (req, res, next) => {
    try {
      // 1. Request
      const user = req.user;
      // 2. Service
      const data = await authService.logOut(user);
      // 3. Response
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.LOG_OUT.SUCCEED,
        data: {
          userId: data.userId,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  /** 토큰 재발급 API **/
  reToken = async (req, res, next) => {
    try {
      // 1. Request
      const user = req.user;
      // 2. Service
      const data = await authService.reToken(user);
      // 3. Response
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.COMMON.JWT.RE_TOKEN,
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };
}
