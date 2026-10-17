import { Component, computed, DestroyRef, effect, inject, input, OnInit } from '@angular/core';

import { TaskComponent } from './task/task.component';
import { TasksService } from './tasks.service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  imports: [TaskComponent, RouterLink],
})
export class TasksComponent implements OnInit {
  userId = input.required<string>();
  // order = input<'asc' | 'desc'>(); // instead of using input binding here
  order?: 'asc' | 'desc'; // we can use queryParams observable below to get the order value and assign it to here
  private tasksService = inject(TasksService);
  userTasks = computed(() => this.tasksService.allTasks().filter(task => task.userId === this.userId()));
  
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  
  constructor() {
    effect(() => {
      console.log('User tasks updated:', this.userTasks());
      console.log('userId: ', this.userId());
    });
  }

  ngOnInit(): void {
    const subscription = this.activatedRoute.queryParams.subscribe({
      next: params => this.order = params['order']
    }); // An observable of the query parameters shared by all the routes.

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
