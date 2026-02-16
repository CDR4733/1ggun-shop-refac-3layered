import { prisma } from "../utils/prisma.util.js";

export class ResumesRepository {
  /** 이력서 생성 (C) **/
  createResume = async ({ userId, resumeTitle, resumeContent }) => {
    // 1. DB - Create
    const data = await prisma.resume.create({
      data: {
        userId: +userId,
        resumeTitle: resumeTitle,
        resumeContent: resumeContent,
      },
    });
    // 2. Return
    return data;
  };

  /** 이력서 목록 조회 (R-A) **/
  getAllResumes = async ({ userId, sort }) => {
    // 1. DB - Read (by userId)
    const datas = await prisma.resume.findMany({
      where: { userId: +userId },
      orderBy: {
        createdAt: sort,
      },
      include: {
        user: true, // users 테이블과의 릴레이션으로 가져오기
      },
    });
    // 2. Return
    return datas;
  };

  /** 이력서 상세 조회 (R-D) **/
  getResumeById = async ({ userId, resumeId }) => {
    // 1. DB - Read (by resumeId)
    const data = await prisma.resume.findUnique({
      where: {
        userId: +userId,
        resumeId: +resumeId,
      },
      include: { user: true }, // relation으로 user테이블 가져와!
    });
    // 2. Return
    return data;
  };

  /** 이력서 수정 (U) **/
  updateResume = async ({ userId, resumeId, resumeTitle, resumeContent }) => {
    // 1. DB - Update
    const data = await prisma.resume.update({
      where: {
        userId: +userId,
        resumeId: +resumeId,
      },
      data: {
        ...(resumeTitle && { resumeTitle: resumeTitle }),
        ...(resumeContent && { resumeContent: resumeContent }),
      },
    });
    // 2. Return
    return data;
  };

  /** 이력서 삭제 (D) **/
  deleteResume = async ({ userId, resumeId }) => {
    // 1. DB - Delete
    const data = await prisma.resume.delete({
      where: {
        userId: +userId,
        resumeId: +resumeId,
      },
    });
    // 2. Return
    return data;
  };

  /** 이력서 지원 상태 변경 (U) **/
  resumeStatusUpdate = async () => {};

  /** 이력서 로그 생성 (C) **/
  createResumeLog = async () => {};

  /** 이력서 로그 목록 조회 (R-A) **/
  getResumeLogs = async ({ resumeId }) => {
    // 1. DB - Read (by resumeId)
    const datas = await prisma.resumeLog.findMany({
      where: {
        resumeId: resumeId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        recruiter: true,
      },
    });
    // 2. Return
    return datas;
  };
}
