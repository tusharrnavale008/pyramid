import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

const USER_SUMMARY = { id: true, fullName: true, avatarUrl: true } as const;

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Confirms the project exists AND belongs to a workspace the current
   * user is a member of. Every task operation below goes through a
   * project (directly or via the task's projectId), so this one check
   * is what keeps users from touching data outside their workspace.
   */
  private async assertProjectAccess(userId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, workspace: { members: { some: { userId } } } },
    });
    if (!project) throw new NotFoundException('Project not found');
  }

  async findAllForWorkspace(userId: string) {
    return this.prisma.task.findMany({
      where: { project: { workspace: { members: { some: { userId } } } } },
      include: {
        assignees: { include: { user: { select: USER_SUMMARY } } },
        labels: { include: { label: true } },
        project: { select: { id: true, name: true } },
        _count: { select: { subtasks: true, comments: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findAllForProject(userId: string, projectId: string) {
    await this.assertProjectAccess(userId, projectId);
    return this.prisma.task.findMany({
      where: { projectId },
      include: {
        assignees: { include: { user: { select: USER_SUMMARY } } },
        labels: { include: { label: true } },
        _count: { select: { subtasks: true, comments: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(userId: string, projectId: string, dto: CreateTaskDto) {
    await this.assertProjectAccess(userId, projectId);
    const { assigneeIds, startDate, dueDate, ...rest } = dto;

    return this.prisma.task.create({
      data: {
        ...rest,
        projectId,
        reporterId: userId,
        startDate: startDate ? new Date(startDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assignees: assigneeIds?.length
          ? { create: assigneeIds.map((id) => ({ userId: id })) }
          : undefined,
      },
      include: {
        assignees: { include: { user: { select: USER_SUMMARY } } },
        labels: { include: { label: true } },
      },
    });
  }

  async findOne(userId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, project: { workspace: { members: { some: { userId } } } } },
      include: {
        assignees: { include: { user: { select: USER_SUMMARY } } },
        labels: { include: { label: true } },
        subtasks: { orderBy: { createdAt: 'asc' } },
        comments: {
          include: { user: { select: USER_SUMMARY } },
          orderBy: { createdAt: 'asc' },
        },
        reporter: { select: USER_SUMMARY },
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    await this.findOne(userId, id);
    const { assigneeIds, startDate, dueDate, ...rest } = dto;

    if (assigneeIds) {
      await this.prisma.taskAssignee.deleteMany({ where: { taskId: id } });
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...rest,
        startDate: startDate ? new Date(startDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assignees: assigneeIds?.length
          ? { create: assigneeIds.map((uid) => ({ userId: uid })) }
          : undefined,
      },
      include: {
        assignees: { include: { user: { select: USER_SUMMARY } } },
        labels: { include: { label: true } },
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.task.delete({ where: { id } });
    return { success: true };
  }

  async addSubtask(userId: string, taskId: string, dto: CreateSubtaskDto) {
    await this.findOne(userId, taskId);
    return this.prisma.subtask.create({
      data: {
        taskId,
        title: dto.title,
        priority: dto.priority,
        memberId: dto.memberId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  async addComment(userId: string, taskId: string, dto: CreateCommentDto) {
    await this.findOne(userId, taskId);
    return this.prisma.comment.create({
      data: { taskId, userId, text: dto.text },
      include: { user: { select: USER_SUMMARY } },
    });
  }
}