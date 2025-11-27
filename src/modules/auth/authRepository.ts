import SessionModel from "./models/sessionModel";

export class AuthRepository {
  async createSession(token: string, ip: string, userId: string, tokenPush: String): Promise<SessionModel> {
    return await SessionModel.create({ token, ip, userId, tokenPush });
  }

  async findSessionByToken(token: string): Promise<SessionModel | null> {
    return await SessionModel.findOne({ where: { token } });
  }

  async deleteSession(token: string): Promise<boolean> {
    const session = await SessionModel.findOne({ where: { token } });
    if (!session) return false;
    await session.destroy();
    return true;
  }

  async deleteUserSessions(userId: string): Promise<number> {
    return await SessionModel.destroy({ where: { userId } });
  }
}
