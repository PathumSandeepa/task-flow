import { Injectable, NotFoundException } from '@nestjs/common';
import type { Task, CreateTaskDto, UpdateTaskDto } from '@task-flow/types';

@Injectable()
export class TasksService {
  private tasksMap: Map<number, Task[]> = new Map();
  private idCounter = 1;

  getTasks(userId: number): Task[] {
    return this.tasksMap.get(userId) || [];
  }

  createTask(userId: number, dto: CreateTaskDto): Task {
    const userTasks = this.getTasks(userId);
    const newTask: Task = {
      id: this.idCounter++,
      title: dto.title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    userTasks.push(newTask);
    this.tasksMap.set(userId, userTasks);
    return newTask;
  }

  toggleTask(userId: number, taskId: number): Task {
    const userTasks = this.getTasks(userId);
    const taskIndex = userTasks.findIndex((t) => t.id === taskId);

    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    userTasks[taskIndex].completed = !userTasks[taskIndex].completed;
    return userTasks[taskIndex];
  }

  editTask(userId: number, taskId: number, dto: UpdateTaskDto): Task {
    const userTasks = this.getTasks(userId);
    const taskIndex = userTasks.findIndex((t) => t.id === taskId);

    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    userTasks[taskIndex].title = dto.title;
    return userTasks[taskIndex];
  }

  deleteTask(userId: number, taskId: number): { success: boolean } {
    const userTasks = this.getTasks(userId);
    const taskIndex = userTasks.findIndex((t) => t.id === taskId);

    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    userTasks.splice(taskIndex, 1);
    this.tasksMap.set(userId, userTasks);
    return { success: true };
  }
}
