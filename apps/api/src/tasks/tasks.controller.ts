import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  JwtPayload,
} from '@task-flow/types';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(@Req() req: Request & { user: JwtPayload }): Task[] {
    return this.tasksService.getTasks(req.user.sub);
  }

  @Post()
  createTask(
    @Req() req: Request & { user: JwtPayload },
    @Body() createTaskDto: CreateTaskDto,
  ): Task {
    return this.tasksService.createTask(req.user.sub, createTaskDto);
  }

  @Patch(':id/toggle')
  toggleTask(
    @Req() req: Request & { user: JwtPayload },
    @Param('id', ParseIntPipe) id: number,
  ): Task {
    return this.tasksService.toggleTask(req.user.sub, id);
  }

  @Patch(':id')
  editTask(
    @Req() req: Request & { user: JwtPayload },
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Task {
    return this.tasksService.editTask(req.user.sub, id, updateTaskDto);
  }

  @Delete(':id')
  deleteTask(
    @Req() req: Request & { user: JwtPayload },
    @Param('id', ParseIntPipe) id: number,
  ): { success: boolean } {
    return this.tasksService.deleteTask(req.user.sub, id);
  }
}
