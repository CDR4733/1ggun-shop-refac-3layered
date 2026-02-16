import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MESSAGES } from "../constants/message.constant.js";

import { ResumesService } from "../services/resumes.service.js";

const resumesService = new ResumesService();

export class ResumesController {
  /** 이력서 생성 API **/
  createResume = async (req, res, next) => {
    try {
      // 1. Request
      const user = req.user;
      const { resumeTitle, resumeContent } = req.body;
      // 2. Service
      const data = await resumesService.createResume({
        user,
        resumeTitle,
        resumeContent,
      });
      // 3. Response
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.RESUMES.CREATE.SUCCEED,
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };

  /** 이력서 목록 조회 API **/
  getAllResumes = async (req, res, next) => {
    try {
      // 1. Request : user, sort
      const user = req.user;
      let { sort } = req.query;
      sort = sort?.toLowerCase();
      if (sort !== "desc" && sort !== "asc") {
        sort = "desc"; // default는 desc
      }
      // 2. Service
      const datas = await resumesService.getAllResumes({ user, sort });
      // 3. Response
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.READ_LIST.SUCCEED,
        data: datas,
      });
    } catch (err) {
      next(err);
    }
  };

  /** 이력서 상세 조회 API **/
  getOneResume = async (req, res, next) => {
    try {
      // 1. Request
      const user = req.user;
      const resumeId = +req.params.resumeId;
      // 2. Service
      const data = await resumesService.getOneResume({ user, resumeId });
      // 3. Response
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.READ_DETAIL.SUCCEED,
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };

  /** 이력서 수정 API **/
  updateResume = async (req, res, next) => {
    try {
      // 1. Request
      const user = req.user;
      const resumeId = +req.params.resumeId;
      const { resumeTitle, resumeContent } = req.body;
      // 2. Service
      const data = await resumesService.updateResume({
        user,
        resumeId,
        resumeTitle,
        resumeContent,
      });
      // 3. Response
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.UPDATE.SUCCEED,
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };

  /** 이력서 삭제 API **/
  deleteResume = async (req, res, next) => {
    try {
      // 1. Request
      const user = req.user;
      const resumeId = +req.params.resumeId;
      // 2. Service
      const data = await resumesService.deleteResume({ user, resumeId });
      // 3. Response
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.DELETE.SUCCEED,
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };

  /** 이력서 지원 상태 변경 API **/
  resumeStatusUpdate = async (req, res, next) => {
    try {
      // 1. Request
      const user = req.user;
      const resumeId = +req.params.resumeId;
      const { resumeStatus, reason } = req.body;
      // 2. Service
      const data = await resumesService.resumeStatusUpdate({
        user,
        resumeId,
        resumeStatus,
        reason,
      });
      // 3. Response
      return res.status(HTTP_STATUS.OK).json({
        stats: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.UPDATE.STATUS.SUCCEED,
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };

  /** 로그 목록 조회 API **/
  getResumeLogs = async (req, res, next) => {
    try {
      // 1. Request
      const resumeId = +req.params.resumeId;
      // 2. Service
      const datas = await resumesService.getResumeLogs({ resumeId });
      // 3. Response
      return res.status(HTTP_STATUS.OK).json({
        stats: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.READ_LIST.LOG.SUCCEED,
        data: datas,
      });
    } catch (err) {
      next(err);
    }
  };
}
