import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { HttpEventType, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { tap } from 'rxjs/internal/operators/tap';

function loggingInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
    // TESTING:
    // const req = request.clone({
    //     headers: request.headers.set('X-DEBUG', 'TESTING')
    // });
    console.log('=== Outgoing request === request: ', request);
    return next(request).pipe(
        tap({
            next: event => {
                if (event.type === HttpEventType.Response) {
                    console.log('=== Incoming response === event status: ', event.status);
                    console.log('=== Incoming response === event body: ', event.body);
                }
            }
        })
    );
}

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(
            withInterceptors([loggingInterceptor])
        ),
    ]
}).catch((err) => console.error(err));
