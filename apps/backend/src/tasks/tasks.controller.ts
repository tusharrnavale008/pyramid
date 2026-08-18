import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateResourceDto } from './dto/create-resource.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('tasks')
  findAllForWorkspace(@CurrentUser() userId: string) {
    return this.tasksService.findAllForWorkspace(userId);
  }

  @Get('projects/:projectId/tasks')
  findAllForProject(
    @CurrentUser() userId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.tasksService.findAllForProject(userId, projectId);
  }

  @Post('projects/:projectId/tasks')
  create(
    @CurrentUser() userId: string,
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.create(userId, projectId, dto);
  }

  @Get('tasks/:id')
  findOne(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.tasksService.findOne(userId, id);
  }

  @Patch('tasks/:id')
  update(
    @CurrentUser() userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(userId, id, dto);
  }

  @Delete('tasks/:id')
  remove(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.tasksService.remove(userId, id);
  }

  @Post('tasks/:id/subtasks')
  addSubtask(
    @CurrentUser() userId: string,
    @Param('id') id: string,
    @Body() dto: CreateSubtaskDto,
  ) {
    return this.tasksService.addSubtask(userId, id, dto);
  }

  @Post('tasks/:id/comments')
  addComment(
    @CurrentUser() userId: string,
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.tasksService.addComment(userId, id, dto);
  }

  @Post('tasks/:id/labels/:labelId')
  attachLabel(
    @CurrentUser() userId: string,
    @Param('id') id: string,
    @Param('labelId') labelId: string,
  ) {
    return this.tasksService.attachLabel(userId, id, labelId);
  }

  @Delete('tasks/:id/labels/:labelId')
  detachLabel(
    @CurrentUser() userId: string,
    @Param('id') id: string,
    @Param('labelId') labelId: string,
  ) {
    return this.tasksService.detachLabel(userId, id, labelId);
  }

  @Post('tasks/:id/resources')
  addResource(
    @CurrentUser() userId: string,
    @Param('id') id: string,
    @Body() dto: CreateResourceDto,
  ) {
    return this.tasksService.addResource(userId, id, dto);
  }

  @Delete('tasks/:id/resources/:resourceId')
  removeResource(
    @CurrentUser() userId: string,
    @Param('id') id: string,
    @Param('resourceId') resourceId: string,
  ) {
    return this.tasksService.removeResource(userId, id, resourceId);
  }
}