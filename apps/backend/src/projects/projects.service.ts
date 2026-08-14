import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getWorkspaceId(userId: string): Promise<string> {
    const membership = await this.prisma.workspaceMember.findFirst({
      where: { userId },
    });
    if (!membership) {
      throw new ForbiddenException('User has no workspace');
    }
    return membership.workspaceId;
  }

  async findAll(userId: string) {
    const workspaceId = await this.getWorkspaceId(userId);
    return this.prisma.project.findMany({
      where: { workspaceId },
      include: {
        lead: { select: { id: true, fullName: true, avatarUrl: true } },
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, dto: CreateProjectDto) {
    const workspaceId = await this.getWorkspaceId(userId);
    return this.prisma.project.create({
      data: {
        name: dto.name,
        priority: dto.priority,
        leadId: dto.leadId,
        workspaceId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  async findOne(userId: string, id: string) {
    const workspaceId = await this.getWorkspaceId(userId);
    const project = await this.prisma.project.findFirst({
      where: { id, workspaceId },
      include: {
        lead: { select: { id: true, fullName: true, avatarUrl: true } },
        tasks: {
          include: {
            assignees: { include: { user: { select: { id: true, fullName: true, avatarUrl: true } } } },
            labels: { include: { label: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(userId: string, id: string, dto: UpdateProjectDto) {
    await this.findOne(userId, id);
    return this.prisma.project.update({
      where: { id },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.project.delete({ where: { id } });
    return { success: true };
  }
}