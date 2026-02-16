import { HttpError } from "../errors/http.error.js";
import { MESSAGES } from "../constants/message.constant.js";

import { prisma } from "../utils/prisma.util.js";
import { ResumesRepository } from "../repositories/resumes.repository.js";

const resumesRepository = new ResumesRepository();

export class ResumesService {
  /** 이력서 생성 API **/
  createResume = async ({ user, resumeTitle, resumeContent }) => {
    // 1. Argument
    const userId = +user.userId;
    // 2. Repository
    const data = await resumesRepository.createResume({
      userId,
      resumeTitle,
      resumeContent,
    });
    // 3. Return
    return data;
  };

  /** 이력서 목록 조회 API **/
  getAllResumes = async ({ user, sort }) => {
    // 1. Argument
    const userId = +user.userId;
    // 2. Repository
    const datas = await resumesRepository.getAllResumes({ userId, sort });
    // 3. Filter
    const filteredDatas = datas.map((e) => ({
      resumeId: +e.resumeId,
      name: e.user.name,
      resumeTitle: e.resumeTitle,
      resumeContent: e.resumeContent,
      resumeStatus: e.resumeStatus,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    }));
    // 4. Return
    return filteredDatas;
  };

  /** 이력서 상세 조회 API **/
  getOneResume = async ({ user, resumeId }) => {
    // 1. Argument
    const userId = +user.userId;
    // 2. Repository
    const data = await resumesRepository.getResumeById({ userId, resumeId });
    // 2-1. Not Found (404)
    if (!data) {
      throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NON_FOUND);
    }
    // 3. Filter
    const filteredData = {
      resumeId: +data.resumeId,
      name: data.user.name,
      resumeTitle: data.resumeTitle,
      resumeContent: data.resumeContent,
      resumeStatus: data.resumeStatus,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
    // 4. Return
    return filteredData;
  };

  /** 이력서 수정 API **/
  updateResume = async ({ user, resumeId, resumeTitle, resumeContent }) => {
    // 1. Argument
    const userId = +user.userId;
    // 2. Repository - Read
    const resume = await resumesRepository.getResumeById({ userId, resumeId });
    // 2-1. Not Found (404)
    if (!resume) {
      throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NON_FOUND);
    }
    // 3. Repository - Update
    const data = await resumesRepository.updateResume({
      userId,
      resumeId,
      resumeTitle,
      resumeContent,
    });
    // 4. Return
    return data;
  };

  /** 이력서 삭제 API **/
  deleteResume = async ({ user, resumeId }) => {
    // 1. Argument
    const userId = +user.userId;
    // 2. Repository - Read
    const resume = await resumesRepository.getResumeById({ userId, resumeId });
    // 2-1. Not Found (404)
    if (!resume) {
      throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NON_FOUND);
    }
    // 3. Repository - Delete
    const data = await resumesRepository.deleteResume({ userId, resumeId });
    // 4. Return
    return data;
  };

  /** 이력서 지원 상태 변경 API **/
  resumeStatusUpdate = async ({ user, resumeId, resumeStatus, reason }) => {
    // 1. Argument
    const recruiterId = +user.userId;
    // 2. Repository - Transaction : status 수정 + log 생성
    await prisma.$transaction(async (tx) => {
      // 2-1. Resume
      const resume = await tx.resume.findUnique({
        where: {
          resumeId: +resumeId,
        },
      });
      // 2-2. Not Found (404)
      if (!resume) {
        throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NON_FOUND);
      }
      // 2-3. Update Resume Status
      const updatedResume = await tx.resume.update({
        where: {
          resumeId: +resumeId,
        },
        data: {
          resumeStatus: resumeStatus,
        },
      });
      // 2-4. Create Resume Logs
      const log = await tx.resumeLog.create({
        data: {
          recruiterId: +recruiterId,
          resumeId: +resumeId,
          oldStatus: resume.resumeStatus,
          newStatus: updatedResume.resumeStatus,
          reason: reason,
        },
      });
      // 3. Return
      return log;
    });
  };

  /** 이력서 로그 목록 조회 API **/
  getResumeLogs = async ({ resumeId }) => {
    // 1. Repository - Read
    const logs = await resumesRepository.getResumeLogs({ resumeId });
    // 2. Filter
    const filteredDatas = logs.map((e) => ({
      lodId: e.logId,
      recruiterName: e.recruiter.name,
      resumeId: e.resumeId,
      oldStatus: e.oldStatus,
      newStatus: e.newStatus,
      reason: e.reason,
      createdAt: e.createdAt,
    }));
    // 3. Return
    return filteredDatas;
  };
}
