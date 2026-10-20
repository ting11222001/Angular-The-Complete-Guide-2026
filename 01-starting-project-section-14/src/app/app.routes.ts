import { Routes } from "@angular/router";
import { NoTaskComponent } from "./tasks/no-task/no-task.component";
import { resolveUserName, UserTasksComponent } from "./users/user-tasks/user-tasks.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { routes as userRoutes } from "./users/users.routes"; // use an alias to avoid name collision with the routes variable in this file

export const routes: Routes = [
    {
        path: '',  // <your-domain>/
        component: NoTaskComponent
        // redirectTo: '/users/u1', // <your-domain>/users/u1
        // pathMatch: 'full'
    },
    {
        path: 'users/:userId', // <your-domain>/users/u1
        component: UserTasksComponent,
        children: userRoutes,
        data: {
            message: 'Hello!',
        },
        resolve: {
            userName: resolveUserName
        }
    },
    {
        path: '**', // <your-domain>/anything-else
        component: NotFoundComponent
    }
]