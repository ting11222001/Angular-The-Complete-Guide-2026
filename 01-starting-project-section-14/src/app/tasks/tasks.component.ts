import {
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

import { TaskComponent } from './task/task.component';
import { TasksService } from './tasks.service';
import { ActivatedRouteSnapshot, ResolveFn, RouterLink } from '@angular/router';
import { Task } from './task/task.model';

export const resolveUserTasks: ResolveFn<Task[]> = (
  activatedRoute: ActivatedRouteSnapshot,
) => {
  const tasksService = inject(TasksService);
  const tasks = tasksService
      .allTasks()
      .filter((task) => task.userId === activatedRoute.paramMap.get('userId'));
  const order = activatedRoute.queryParamMap.get('order');
  
  if (order && order === 'asc') {
    tasks.sort((a, b) => {
      return a.id < b.id ? -1 : 1;
    });
  } else {
    tasks.sort((a, b) => {
      return a.id > b.id ? -1 : 1;
    })
  }
  return tasks;
};

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  imports: [TaskComponent, RouterLink],
})
export class TasksComponent {
  userTasks = input.required<Task[]>();
  userId = input.required<string>();
  order = input<'asc' | 'desc'>('desc'); // change from signal to input to make it reactive to query parameter changes

  constructor() {
    effect(() => {    // this is only for demo purpose
      console.log('User tasks updated:', this.userTasks());
      console.log('userId: ', this.userId());
    });
  }
}
