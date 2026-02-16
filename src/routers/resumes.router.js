import express from "express";
import { USER_ROLE } from "../constants/user.constant.js";
import { requireRoles } from "../middlewares/require-roles.middleware.js";

import { createResumeValidator } from "../middlewares/validators/create-resume.validator.js";
import { updateResumeValidator } from "../middlewares/validators/update-resume.validator.js";
import { updateResumeStatusValidator } from "../middlewares/validators/update-resume-status.validator.js";

import { ResumesController } from "../controllers/resumes.controller.js";

const resumesRouter = express.Router();
const resumesController = new ResumesController();

/** 이력서 생성 API(C) **/
resumesRouter.post("/", createResumeValidator, resumesController.createResume);

/** 이력서 목록 조회 API(R-A) **/
resumesRouter.get("/", resumesController.getAllResumes);

/** 이력서 상세 조회 API(R-D) **/
resumesRouter.get("/:resumeId", resumesController.getOneResume);

/** 이력서 수정 API(U) **/
resumesRouter.patch(
  "/:resumeId",
  updateResumeValidator,
  resumesController.updateResume,
);

/** 이력서 삭제 API(D) **/
resumesRouter.delete("/:resumeId", resumesController.deleteResume);

/** 이력서 지원 상태 변경 API(U) **/
resumesRouter.patch(
  "/:resumeId/status",
  requireRoles([USER_ROLE.RECRUITER]),
  updateResumeStatusValidator,
  resumesController.resumeStatusUpdate,
);

/** 로그 목록 조회 API(R-A) **/
resumesRouter.get(
  "/:resumeId/logs",
  requireRoles([USER_ROLE.RECRUITER]),
  resumesController.getResumeLogs,
);

export { resumesRouter };
