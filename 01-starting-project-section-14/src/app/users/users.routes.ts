import { Routes } from "@angular/router";
import { resolveUserTasks, TasksComponent } from "../tasks/tasks.component";
import { canLeaveEditPage, NewTaskComponent } from "../tasks/new-task/new-task.component";

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full'
    },
    {
        path: 'tasks', // <your-domain>/users/u1/tasks -> temporary route to show all tasks for a user
        component: TasksComponent,
        // runGuardsAndResolvers: 'paramsOrQueryParamsChange', // make sure resolveUserTasks will be re-executed by angular whenever the route parameter or the query parameter change
        runGuardsAndResolvers: 'always', // make sure Angular will run this resolveUserTasks again as neither the path params nor the the query params are changing
        resolve: {
            userTasks: resolveUserTasks
        }
    },
    {
        path: 'tasks/new', // <your-domain>/users/u1/tasks/new
        component: NewTaskComponent,
        canDeactivate: [canLeaveEditPage]
    }
]