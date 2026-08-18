import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabelDto } from './dto/create-label.dto';

@Injectable()
export class LabelsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getWorkspaceId(userId: string): Promise<string> {
    const membership = await this.prisma.workspaceMember.findFirst({
      where: { userId },
    });
    if (!membership) throw new ForbiddenException('User has no workspace');
    return membership.workspaceId;
  }

  async findAll(userId: string) {
    const workspaceId = await this.getWorkspaceId(userId);
    return this.prisma.label.findMany({
      where: { workspaceId },
      orderBy: { name: 'asc' },
    });
  }

  async create(userId: string, dto: CreateLabelDto) {
    const workspaceId = await this.getWorkspaceId(userId);
    return this.prisma.label.create({
      data: {
        workspaceId,
        name: dto.name,
        color: dto.color ?? '#6b7280',
      },
    });
  }
}