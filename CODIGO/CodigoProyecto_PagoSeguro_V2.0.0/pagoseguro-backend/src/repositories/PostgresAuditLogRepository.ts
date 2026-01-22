import { PrismaClient } from '@prisma/client';
import { IAuditLogRepository, AuditLogData, AuditStatus } from '../lib/interfaces';

export class PostgresAuditLogRepository implements IAuditLogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(log: AuditLogData): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          id: log.id || crypto.randomUUID(),
          userId: log.userId || null, 
          action: log.action,
          module: log.module || 'GENERAL',
          details: log.details || {},
          ipAddress: log.ipAddress || '0.0.0.0',
          userAgent: log.userAgent || 'Unknown',
          status: log.status,
          createdAt: log.createdAt || new Date(),
        },
      });
    } catch (error: any) {
      console.warn(`⚠️ Error guardando audit log (${log.action}):`, error.message);
    }
  }

  async findByUserId(userId: string, limit: number = 50): Promise<AuditLogData[]> {
    return this.mapLogs(
      await this.prisma.auditLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })
    );
  }

  async findByAction(action: string, limit: number = 50): Promise<AuditLogData[]> {
    return this.mapLogs(
      await this.prisma.auditLog.findMany({
        where: { action },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })
    );
  }

  async findRecent(limit: number = 100): Promise<AuditLogData[]> {
    return this.mapLogs(
      await this.prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
      })
    );
  }


  private mapLogs(logs: any[]): AuditLogData[] {
    return logs.map((log) => ({
      id: log.id,
      userId: log.userId || undefined,
      action: log.action,
      module: log.module,
      details: (log.details as Record<string, any>) || {},
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      status: log.status as AuditStatus,
      createdAt: log.createdAt,
    }));
  }
}