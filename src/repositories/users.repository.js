import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma.util.js";
import { HASH_SALT_ROUNDS } from "../constants/env.constant.js";

export class UsersRepository {
  /** 회원 생성 (C) **/
  createUser = async ({ email, password, name }) => {
    // 1. Password Hash
    const hashedPassword = bcrypt.hashSync(password, HASH_SALT_ROUNDS);
    // 2. DB - Create
    const data = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
      },
      omit: { password: true },
    });
    // 3. Retrun
    return data;
  };

  /** userId로 회원 조회 (R-D) **/
  readUserByUserId = async (userId) => {
    // 1. DB - Read
    const data = await prisma.user.findUnique({
      where: { userId: userId },
      omit: { password: true },
    });
    // 2. Return
    return data;
  };

  /** email로 회원 조회 (R-D) **/
  readUserByEmail = async (email) => {
    // 1. DB - Read
    const data = await prisma.user.findUnique({ where: { email: email } });
    // 2. Return
    return data;
  };
}
