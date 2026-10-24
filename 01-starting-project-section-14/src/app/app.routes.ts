import { CanMatchFn, RedirectCommand, Routes, Router } from "@angular/router";
import { NoTaskComponent } from "./tasks/no-task/no-task.component";
import { resolveTitle, resolveUserName, UserTasksComponent } from "./users/user-tasks/user-tasks.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { routes as userRoutes } from "./users/users.routes"; // use an alias to avoid name collision with the routes variable in this file
import { inject } from '@angular/core';
import { canLeaveEditPage } from "./tasks/new-task/new-task.component";

const dummyCanmMatch: CanMatchFn = (route, segments) => { // route is the route I'm trying to match and segments is an array of URL segments that are matched by the route
    const router = inject(Router);
    const shouldGetAccess = Math.random();
    if (shouldGetAccess < 0.5) { // so 50% go to `/unauthorized`, 50% pass
        return true; // return a boolean value to indicate whether the route can be matched or not
    }
    return new RedirectCommand(router.parseUrl('/unauthorized')); // return a RedirectCommand to redirect to another route to avoid breaking the app. Pass in a url and it will be converted to an url tree object
}; 

export const routes: Routes = [
    {
        path: '',  // <your-domain>/
        component: NoTaskComponent,
        // redirectTo: '/users/u1', // <your-domain>/users/u1
        // pathMatch: 'full'
        title: 'No Task Selected'
    },
    {
        path: 'users/:userId', // <your-domain>/users/u1
        component: UserTasksComponent,
        children: userRoutes,
        // canMatch: [dummyCanmMatch], // added! This is only for demo purpose, to show how canMatch works. Angular will call this function for me, so I don't need to execute here i.e. no need to dummyCanMatch() here. Angular will call this function for me, so I don't need to execute here i.e. no need to dummyCanMatch() here.
        data: {
            message: 'Hello!',
        },
        resolve: {
            userName: resolveUserName
        },
        title: resolveTitle
    },
    {
        path: '**', // <your-domain>/anything-else
        component: NotFoundComponent,
    }
]