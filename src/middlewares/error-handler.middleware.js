import { HTTP_STATUS } from "../constants/http-status.constant.js";

export const errorHandler = (err, req, res, next) => {
  // 0. Error 출력
  console.error(err);

  // 1. Joi에서 발생한 Error 처리
  if (err.name === "ValidationError") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: HTTP_STATUS.BAD_REQUEST,
      message: err.message,
    });
  }

  // 2. Http Error 처리
  if (err.status && err.message) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
  }

  // 3. 그 밖의 예상치 못한 Error 처리
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: "예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.",
  });
};
