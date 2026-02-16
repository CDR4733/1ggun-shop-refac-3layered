import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma.util.js";
import { HASH_SALT_ROUNDS } from "../constants/env.constant.js";

export class RefreshTokensRepository {
  /** 토큰 생성 및 업데이트 (C/U) **/
  upsertToken = async ({ userId, refreshToken }) => {
    // 1. RefreshToken Hash
    const hashedRefreshToken = bcrypt.hashSync(refreshToken, HASH_SALT_ROUNDS);
    // 2. DB - Upsert
    const data = await prisma.refreshToken.upsert({
      where: {
        userId: userId,
      },
      update: {
        refreshToken: hashedRefreshToken,
      },
      create: {
        userId: userId,
        refreshToken: hashedRefreshToken,
      },
    });
    // 3. Return
    return data;
  };

  /** 토큰 조회 (R-D) **/
  findTokenByUserId = async (userId) => {
    // 1. DB - Read
    const data = await prisma.refreshToken.findUnique({
      where: { userId: userId },
    });
    // 2. Return
    return data;
  };

  /** 토큰 삭제 (D) **/
  deleteToken = async (userId) => {
    // 1. DB - Delete
    const data = await prisma.refreshToken.delete({
      where: { userId: userId },
    });
    // 2. Return
    return data;
  };
}
