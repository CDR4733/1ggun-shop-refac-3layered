import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../constants/env.constant.js";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from "../constants/auth.constant.js";

import { HttpError } from "../errors/http.error.js";
import { MESSAGES } from "../constants/message.constant.js";

import { UsersRepository } from "../repositories/users.repository.js";
import { RefreshTokensRepository } from "../repositories/refresh-tokens.repository.js";

const usersRepository = new UsersRepository();
const refreshTokensRepository = new RefreshTokensRepository();

export class AuthService {
  /** 회원가입 API **/
  signUp = async ({ email, password, name }) => {
    // 1. 이메일 중복 확인
    const isExistingEmail = await usersRepository.readUserByEmail(email);
    // 1-1. 중복인 경우 에러(409)
    if (isExistingEmail) {
      throw new HttpError.Conflict(MESSAGES.AUTH.SIGN_UP.FAIL.EMAIL.DUPLICATED);
    }
    // 2. Repository
    const data = await usersRepository.createUser({ email, password, name });
    // 3. Return
    return data;
  };

  /** 로그인 API **/
  logIn = async ({ email, password }) => {
    // 1. 해당 회원이 존재하는지 확인
    const user = await usersRepository.readUserByEmail(email);
    // 2. 입력된 비밀번호가 DB에 저장된 비밀번호와 일치하는지 확인
    const isPasswordMatched =
      user && bcrypt.compareSync(password, user.password);
    // 3. 회원이 존재하지 않거나 비밀번호가 틀린 경우 에러(401)
    if (!isPasswordMatched) {
      throw new HttpError.Unauthorized(MESSAGES.AUTH.LOG_IN.FAIL.UNAUTHORIZED);
    }
    // 4. Payload로 Token 생성
    const payload = { userId: user.userId };
    const data = await this.generateAuthToken(payload);
    // 5. Return
    return data;
  };

  /** 로그아웃 API **/
  logOut = async (user) => {
    // 1. Argument
    const userId = user.userId;
    // 2. Repository
    const data = await refreshTokensRepository.deleteToken(userId);
    // 3. Return
    return data;
  };

  /** 토큰 재발급 API **/
  reToken = async (user) => {
    // 1. Payload
    const payload = { userId: user.userId };
    // 2. Token
    const data = await this.generateAuthToken(payload);
    // 3. Return
    return data;
  };

  /** 토큰 생성 함수 **/
  generateAuthToken = async (payload) => {
    // 1. Argument
    const userId = payload.userId;
    // 2. Tokens
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
    // 3. Repository
    await refreshTokensRepository.upsertToken({
      userId,
      refreshToken,
    });
    // 4. Return
    return { accessToken, refreshToken };
  };
}
