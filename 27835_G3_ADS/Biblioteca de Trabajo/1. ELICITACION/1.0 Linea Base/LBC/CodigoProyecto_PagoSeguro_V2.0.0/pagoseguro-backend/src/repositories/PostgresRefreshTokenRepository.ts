import { PrismaClient } from '@prisma/client';
import { 
  IRefreshTokenRepository, 
  RefreshTokenData 
} from '../lib/interfaces';

export class PostgresRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(token: RefreshTokenData): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        id: token.id,
        token: token.token,
        userId: token.userId,
        expiresAt: token.expiresAt,
        createdAt: token.createdAt,
      },
    });
  }

  async findByToken(token: string): Promise<RefreshTokenData | null> {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!refreshToken) return null;

    return {
      id: refreshToken.id,
      token: refreshToken.token,
      userId: refreshToken.userId,
      expiresAt: refreshToken.expiresAt,
      createdAt: refreshToken.createdAt,
    };
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async deleteByToken(token: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: { token },
    });
  }

  async deleteExpired(): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
