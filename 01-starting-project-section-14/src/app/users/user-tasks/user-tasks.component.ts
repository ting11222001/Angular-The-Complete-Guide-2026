import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { UsersService } from '../users.service';
import {
  ActivatedRoute,
  ParamMap,
  RouterLink,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-user-tasks',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './user-tasks.component.html',
  styleUrl: './user-tasks.component.css',
})
export class UserTasksComponent implements OnInit {
  // Solution 1:
  // userId = input.required<string>();

  // private usersService = inject(UsersService);
  // userName = computed(() =>
  //   this.usersService.users.find(user => user.id === this.userId())?.name
  // );

  // Solution 2:
  private activatedRoute = inject(ActivatedRoute);
  private usersService = inject(UsersService);
  private destroyRef = inject(DestroyRef);
  userName = '';

  // Access the static data from routes - Solution 1:
  message = input.required<string>();

  ngOnInit() {
    console.log('this.message: ', this.message());
    console.log('this.activatedRoute: ', this.activatedRoute);
    console.log('this.activatedRoute.paramMap: ', this.activatedRoute.paramMap);
    console.log('this.activatedRoute.snapshot: ', this.activatedRoute.snapshot);
    console.log('this.activatedRoute.snapshot.params: ', this.activatedRoute.snapshot.params);
    console.log(
      "this.activatedRoute.snapshot.paramMap.get('userId'): ",
      this.activatedRoute.snapshot.paramMap.get('userId'),
    );
    const subscription = this.activatedRoute.paramMap.subscribe({
      next: (paramMap: ParamMap) =>
        (this.userName =
          this.usersService.users.find(
            (user) => user.id === paramMap.get('userId'),
          )?.name || ''),
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
