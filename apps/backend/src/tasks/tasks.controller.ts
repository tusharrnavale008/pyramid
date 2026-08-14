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

// No controller-level route prefix — each handler declares its own full
// path below, so "/tasks" (all), "/projects/:projectId/tasks" (nested),
// and "/tasks/:id" (single-task ops) all live in one place.
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
}