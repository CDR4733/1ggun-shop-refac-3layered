import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MESSAGES } from "../constants/message.constant.js";

export class UsersController {
  /** 내 정보 보기 API(R-D) **/
  readMe = (req, res, next) => {
    try {
      // 1. Request
      const data = req.user;
      // 2. Response
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.USERS.READ.ME.SUCCEED,
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };
}
