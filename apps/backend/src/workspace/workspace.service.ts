import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  async getMembers(userId: string) {
    const membership = await this.prisma.workspaceMember.findFirst({
      where: { userId },
    });
    if (!membership) throw new ForbiddenException('User has no workspace');

    const members = await this.prisma.workspaceMember.findMany({
      where: { workspaceId: membership.workspaceId },
      include: {
        user: {
          select: { id: true, fullName: true, avatarUrl: true, email: true },
        },
      },
    });

    return members.map((m) => m.user);
  }
}