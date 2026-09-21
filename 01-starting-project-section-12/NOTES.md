# NOTES

This is a place where I take notes for the practice project of the section 12 of the course, `Sending HTTP Requests and Handling Responses`.

## Setup the Starting Project

Follow what I did for the section 9 exercise.

Then, run `npm install`, and then `npm start` for the main project folder of this section, which is the angular app folder.

Then, go inside `backend` and then run `npm install` there also.

Essentially, the angular and the backend are two separate projects with their own dependencies. Then, run `npm start` to start the backend web API. I will need to keep this backend process up and running to allow my angular app to connect to it later.

Then, in a separate terminal, run the angular app by entering the main project folder of this section. Run `npm start`.

Its branch is `app-http-place-picker`.

I also created a folder for screenshots of this app practice, `section12-demo`.

## The starting projects: frontend & backend

`backend` folder is a simple Node Express application for this exercise.

`data` > `places.json` etc.: these are dummy data.

This section is to practice to reach out to the backend from Angular app.

Run up the angular app by `npm start` in the main project folder of this section. I'm able to see this:

![Project12-screenshot1](/01-starting-project-section-12/section12-demo/Project-12-2026-09-09-1.png)

## Connecting Angular apps to a Backend

I basically have to send http requests inside the angular app to the backend api, either to fetch some data or to store some data there.

Then the api will send a response with the requested data.

For example, in `app.js`, there is a GET method:

```js
app.get("/places", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const fileContent = await fs.readFile("./data/places.json");

  const placesData = JSON.parse(fileContent);

  res.status(200).json({ places: placesData }); // here's the response!
});
```

It will get data from `places.json` here:

```json
[
  {
    "id": "p1",
    "title": "Forest Waterfall",
    "image": {
      "src": "forest-waterfall.jpg",
      "alt": "A tranquil forest with a cascading waterfall amidst greenery."
    },
    "lat": 44.5588,
    "lon": -80.344
  },
  ...
]
```

## Getting Started with Angular's HTTP Client

How do I send HTTP requests in angular applications?

In `AvailablePlacesComponent`, use this `HttpClient` service:

```ts
import { HttpClient } from '@angular/common/http';

export class AvailablePlacesComponent {
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient); // added!
}
```

Remember! I need to set up a provider for this `HttpClient` service so that Angular will know how to inject this service, or it will show this error in the `localhost:4200`:

```
core.mjs:7195 ERROR NullInjectorError: R3InjectorError(Environment Injector)[_HttpClient -> _HttpClient]: 
  NullInjectorError: No provider for _HttpClient!
```

And to make it available for the entire app, add the provider in the `main.ts`.

```ts
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(), // added!
    ]
}).catch((err) => console.error(err));
```

Once the Http Client Provider is added the `NullInjectorError` disappears!

## Sending a GET Request to fetch data

Now my goal is to show all the places from `places.json` into `AvailablePlacesComponent`.

In `ngOnInit()` (this will be executed once the component is ready), send the requests to `/places` (according to `app.get("/places", async (req, res) => {}` in `app.js`):

```ts
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient); // added!

  ngOnInit(): void {
    this.httpClient.get('http://localhost:3000/places') // added!
      .subscribe({
        next: response => console.log(response)
      });
  }
}
```

`this.httpClient.get` returns an observable and I will need to `subscribe` to it to access the stream of data.

Note that `this.httpClient.get` by default emits one value, unless I give it other options.

Now it prints the `response` object with a property, `places`:

```json
{
    "places": [
        {
            "id": "p1",
            "title": "Forest Waterfall",
            "image": {
                "src": "forest-waterfall.jpg",
                "alt": "A tranquil forest with a cascading waterfall amidst greenery."
            },
            "lat": 44.5588,
            "lon": -80.344
        },
        {
            "id": "p2",
            "title": "Sahara Desert Dunes",
            "image": {
                "src": "desert-dunes.jpg",
                "alt": "Golden dunes stretching to the horizon in the Sahara Desert."
            },
            "lat": 25,
            "lon": 0
        },
        ...
    ]
}
```

Then remember to `unsubscribe` but here technically I don't need to do it as `this.httpClient.get` by default only emits one value:

```ts
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef); // added!

  ngOnInit(): void {
    const subscription = this.httpClient.get('http://localhost:3000/places')
      .subscribe({
        next: response => console.log(response)
      });

    this.destroyRef.onDestroy(() => { // added!
      subscription.unsubscribe();
    });
  }
}
```

Also, currently the `response` type is just `(parameter) response: Object`. To give it a type I can add this `<Place[]>`:

```ts
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const subscription = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/places') // added!
      .subscribe({
        next: response => console.log(response.places) // updated!
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
```

The `response` now becomes `(parameter) response: { places: Place[]; }`.

`Place` is a model interface in `place.model.ts` like this:

```ts
export interface Place {
  id: string;
  title: string;
  image: {
    src: string;
    alt: string;
  };
  lat: number;
  lon: number;
}
```

And the shape of data is defined in `app.js`:

```js
res.status(200).json({ places: placesData });
```

So now it will print the array inside of the `response` object directly:

```json
[
    {
        "id": "p1",
        "title": "Forest Waterfall",
        "image": {
            "src": "forest-waterfall.jpg",
            "alt": "A tranquil forest with a cascading waterfall amidst greenery."
        },
        "lat": 44.5588,
        "lon": -80.344
    },
    {
        "id": "p2",
        "title": "Sahara Desert Dunes",
        "image": {
            "src": "desert-dunes.jpg",
            "alt": "Golden dunes stretching to the horizon in the Sahara Desert."
        },
        "lat": 25,
        "lon": 0
    },
    ...
]
```

## Configuring HTTP Requests

So the `this.httpClient.get()` when I hovered on `get`, it showed this:

```
(method) HttpClient.get<{
 places: Place[];
}>(url: string, options?: {
 headers?: HttpHeaders | {
 [header: string]: string | string[];
 };
 context?: HttpContext;
 observe?: "body";
 params?: HttpParams | {
 [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
 };
 reportProgress?: boolean;
 responseType?: "json";
 withCredentials?: boolean;
 transferCache?: {
 includeHeaders?: string[];
 } | boolean;
}): Observable<...> (+14 overloads)

Constructs a GET request that interprets the body as JSON and returns the response body in a given type.

@param url — The endpoint URL.

@param options — The HTTP options to send with the request.

@return — An Observable of the HttpResponse, with a response body in the requested type.
```

So other than `url` i.e. 'http://localhost:3000/places', I can add this `option` object with `observe` property like the below to get `response` object. In layman term, I'm `observing` the `response`:

```ts
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const subscription = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/places', {
      observe: 'response' // added!
    })
      .subscribe({
        next: response => {
          console.log(response);
          console.log(response.body?.places); // pay attention!
        }
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
```

The output of `console.log(response);` is like this:

```
body: {places: Array(18)}
headers: _HttpHeaders {normalizedNames: Map(0), lazyUpdate: null, lazyInit: ƒ}
ok: true
status: 200
statusText: "OK"
type: 4
url: "http://localhost:3000/places"
```

But this is just a demo. I'm going back to just see the response data like this:

```ts
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const subscription = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/places')
      .subscribe({
        next: response => console.log(response.places) // updated!
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
```

The output of `console.log(response.places)` is like this:

```
[
    {
        "id": "p1",
        "title": "Forest Waterfall",
        "image": {
            "src": "forest-waterfall.jpg",
            "alt": "A tranquil forest with a cascading waterfall amidst greenery."
        },
        "lat": 44.5588,
        "lon": -80.344
    },
    {
        "id": "p2",
        "title": "Sahara Desert Dunes",
        "image": {
            "src": "desert-dunes.jpg",
            "alt": "Golden dunes stretching to the horizon in the Sahara Desert."
        },
        "lat": 25,
        "lon": 0
    },
    ...
]
```

## Transforming & Using Response Data

Once the `response` data is available, I use it to set the signal, `places`:

```ts
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const subscription = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/places')
      .subscribe({
        next: response => {
          this.places.set(response.places); // updated!
        }
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
```

Since the `get()` is giving me an observable, I can use `pipe` before we `subscribe` to add an OPERATOR so that I can transform the data that's emitted by the observable BEFORE it reaches the `next` function.

For example, I can use the `map` operator as the param of the `pipe` function. And then pass a function to the `map` operator.

The `map` operator will take this one emitted value, `response`, and make the `response` into just the array i.e. `Place[]`, not the original `places` object i.e. `{ places: Place[] }`.

So the `response` becomes just the `places`:

```ts
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const subscription = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/places')
      .pipe(
        map(response => response.places) // added!
      )
      .subscribe({
        next: places => {           // updated!
            console.log(places);
            this.places.set(places);
        }
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
```

The output of `console.log(places);` directly becomes:

```
[
    {
        "id": "p1",
        "title": "Forest Waterfall",
        "image": {
            "src": "forest-waterfall.jpg",
            "alt": "A tranquil forest with a cascading waterfall amidst greenery."
        },
        "lat": 44.5588,
        "lon": -80.344
    },
    {
        "id": "p2",
        "title": "Sahara Desert Dunes",
        "image": {
            "src": "desert-dunes.jpg",
            "alt": "Golden dunes stretching to the horizon in the Sahara Desert."
        },
        "lat": 25,
        "lon": 0
    },
    ...
]
```

So now on the UI, the `places` are able to be populated like this:

![Project12-screenshot2](/01-starting-project-section-12/section12-demo/Project-12-2026-09-13-1.png)

## Showing a Loading Fallback 

In the `AvailablePlacesComponent`, in the `subscribe` add this `complete` function (which is a callback function that gets called by the producer if and when it has no more values to provide, and no error has happened).

This `complete` function only runs once, once the observable and the offered request is done.

Add a `isLoading` signal.

```ts
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  isLoading = signal<boolean>(false); // added

  ngOnInit(): void {
    this.isLoading.set(true); // added
    const subscription = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/places')
      .pipe(
        map(response => response.places)
      )
      .subscribe({
        next: places => {
          this.places.set(places);
        },
        complete: () => this.isLoading.set(false), // added
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
```

And add a conditional block in the template given the value of `isLoading()` signal:

```html
<app-places-container title="Available Places">
  @if (isLoading()) {
    <p class="fallback-text">Loading available places...</p>
  }
  @if (places()) {
    <app-places [places]="places()!" />
  } @else if (places()?.length === 0) {
    <p class="fallback-text">Unfortunately, no places could be found.</p>
  }
</app-places-container>
```

Now it looks like when loading the places cards:

![Project12-screenshot3](/01-starting-project-section-12/section12-demo/Project-12-2026-09-15-1.png)

## Concept revisit - `pipe()`, `subscribe()`, `Observer` object and its handlers (`next`, `error`, `complete`)

### Why `pipe()` first

An Observable on its own does nothing. It is like a plan or a recipe. It only starts producing values once something subscribes to it. This is called "lazy" behaviour.

`pipe()` lets you chain operators (like `map`) to transform the data before it reaches your code. It does not run anything by itself. It just builds a new Observable that knows "when data comes in, transform it this way first."

Think of it like a filter you attach to a hose before turning the tap on. You are setting up the transformation, not starting the flow yet.

In my code:

```ts
.pipe(
  map(response => response.places)
)
```

This says: "When the HTTP response arrives, take only the `places` field from it." No HTTP call has happened yet at this point.

### Why `subscribe()` starts it

`subscribe()` is what actually triggers the action. For an HTTP Observable, this is the moment the real HTTP request is sent. Before `subscribe()`, nothing happens at all. This is different from a Promise, which starts running as soon as you create it.


### What to call `next`, `error`, `complete`

The object you pass to `subscribe()` is called an Observer. `next`, `error`, and `complete` are its handler functions (also called, `callbacks`). Each one reacts to a different kind of notification from the Observable:

- `next`: called every time a new value arrives. Can happen many times.
- `error`: called if something goes wrong. Stops the stream.
- `complete`: called once, when the Observable finishes sending values (no more data coming).

In my code, `next` saves the places into my signal, and `complete` turns off the `isLoading` flag once the stream has finished.


## Concept revisit - `callback`

A callback is a function you hand to another function. It does not run right away. It runs later, when something happens. Think of it like leaving your phone number with a shop. They call you back when your order is ready. You do not wait at the counter.

In code, these are the common cases where a function is treated as a `callback`:

- Event handlers. A function passed to `addEventListener` or an `onClick` prop. It runs when the user clicks, types, or scrolls.
    - For example:
    ```ts
    // Plain DOM
    document.getElementById('myButton')
    .addEventListener('click', () => {
        console.log('Button was clicked');
    });

    // React / Angular style prop
    <button onClick={() => console.log('Button was clicked')}>
    Click me
    </button>
    ```
    - In both cases, the arrow function is the `callback`. The browser (or the framework) holds onto it and only runs it when the user actually clicks. Nothing happens at the time you write the code.
- Async operations. A function passed to something like `setTimeout`, a file read, or a network request. It runs when the timer ends or the data arrives.
    - For example:
    ```ts
    // setTimeout
    setTimeout(() => {
    console.log('3 seconds have passed');
    }, 3000);
    ```
    - For `setTimeout`, the `callback` runs once the timer finishes.
- Array methods. A function passed to `map`, `filter`, `forEach`, or `reduce`. It runs once for each item in the array. 
    - Note: `map`, `filter`, `forEach`, and `reduce` are array methods that accept a `callback` as an argument. The function you pass into them is the `callback`. 
    - For example:
    ```ts
    const numbers = [1, 2, 3, 4];

    // forEach: runs the callback for each item, returns nothing
    numbers.forEach(num => console.log(num));
    // logs: 1, 2, 3, 4

    // map: runs the callback for each item, builds a new array from the results
    const doubled = numbers.map(num => num * 2);
    // doubled = [2, 4, 6, 8]

    // filter: runs the callback for each item, keeps items where it returns true
    const evens = numbers.filter(num => num % 2 === 0);
    // evens = [2, 4]

    // reduce: runs the callback for each item, builds up a single result
    const total = numbers.reduce((sum, num) => sum + num, 0);
    // total = 10
    ```
- Promise chains. The functions inside `.then()` and `.catch()`. They run after a `promise` resolves or rejects.
    - For example:
    ```ts
    fetch('http://localhost:3000/places')
    .then(response => response.json())
    .then(data => {
        console.log('Places:', data.places);
    })
    .catch(error => {
        console.error('Request failed:', error);
    });
    ```
    - Each function inside `.then()` is a `callback` that runs once the `promise` before it resolves successfully. The function inside `.catch()` is a `callback` that runs only if something in the chain rejects, similar to how `error` works in your RxJS example.

The common thread is this: if a function is passed as an argument, and something else decides when to run it, that function is a `callback`.

How to check: in your own code, look for a function name passed without parentheses, like `onClick={handleClick}` rather than `onClick={handleClick()}`. The lack of parentheses means you are passing the function itself, not calling it straight away. That is usually a sign it is a `callback`.

## Handling HTTP Errors

In `app.js`, add this 500 error response temporarily to create error in UI.

```js
app.get("/places", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return res.status(500).json();
});
```

Then, restart the backend service by ctrl + c and then run `npm start`.

Now in the frontend browser's dev tool, I can see `ERROR HttpErrorResponse`.

Next, in `AvailablePlacesComponent`, use the `error` function to set the `error` signal with the error value it receives from the `this.httpClient.get` observable:

```ts
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  isLoading = signal<boolean>(false);
  error = signal<string>('');  // added!

  ngOnInit(): void {
    this.isLoading.set(true);
    const subscription = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/places')
      .pipe(
        map(response => response.places)
      )
      .subscribe({
        next: places => {
          this.places.set(places);
        },
        error: (error) => {       // added!
        //   this.error.set(error);  // instead of use error directly which is an object
            this.error.set(error.message);  // use its message which should contain a string value.
        },
        complete: () => this.isLoading.set(false),
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
```

Then, update the `AvailablePlacesComponent` template with the `error()` signal:

```html
<app-places-container title="Available Places">
  @if (isLoading() && !error()) {
    <p class="fallback-text">Loading available places...</p>
  }

  @if (error()) {
    <p class="fallback-text">Error: {{ error() }}</p>
  }
  
  @if (places()) {
    <app-places [places]="places()!" />
  } @else if (places()?.length === 0) {
    <p class="fallback-text">Unfortunately, no places could be found.</p>
  }
</app-places-container>
```

So now the UI will show `Error: Http failure response for http://localhost:3000/places: 500 Internal Server Error`:


![Project12-screenshot4](/01-starting-project-section-12/section12-demo/Project-12-2026-09-16-1.png)

But to make my observer function leaner, I can use `catchError` as the 2nd argument in the `pipe` method.

`catchError` will transform the error from the observable emitted by `this.httpClient.get`.

`catchError` needs to return a new observable like `throwError()` which is also from RxJS.

`throwError()` needs to return an error object, so I use JavaScript built-in `Error` class. I can set the user-friendly error message to this `Error` object.

So this way seems more complicated, but it helped getting the error transformation logic out of the observer function.

```ts
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  isLoading = signal<boolean>(false);
  error = signal<string>('');

  ngOnInit(): void {
    this.isLoading.set(true);
    const subscription = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/places')
      .pipe(
        map(response => response.places),
        catchError(error => {  // look!
          console.log('Error fetching places:', error); // logging the original HttpResponse object
          return throwError(   // look!
            () => new Error('Failed to fetch places. Please try again later.')
          );
        })
      )
      .subscribe({
        next: places => {
          this.places.set(places);
        },
        error: (error: Error) => {  // added the type!
          this.error.set(error.message);  // updated the error signal with this: 
          // console.log('this error: ', this.error());
          // That logging the message Failed to fetch places. Please try again later.
        },
        complete: () => this.isLoading.set(false),
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
```

Finally, it looks like this:

![Project12-screenshot5](/01-starting-project-section-12/section12-demo/Project-12-2026-09-16-2.png)

After this exercise, remove the temporary server 500 error from the GET /places method from backend's `app.js`, and restart the backend service.

## Sending data to backend

This exercise helps me practice how to send data to the backend:
- Click on a place card.
- Trigger a put request (send the request with an id, which is a `placeId` in the existing places list).
- Write the clicked place data into `data` folder > `user-places.json`, which represents a datatable in the database that stores the data of the favorite places a user selected.

I already have this route in the `app.js`.

Thie put request needs an input, `placeId`:

```js
app.put("/user-places", async (req, res) => {
  const placeId = req.body.placeId;
```

`PlacesComponent` will emit the clicked place card from `onSelectPlace()`. Its template has a button click listener:

```html
  @for (place of places(); track place.id) {
    <li class="place-item">
      <button (click)="onSelectPlace(place)">
        ...
    }
```

So, when each place item is clicked, the `place` data is sent out to the parent component `AvailablePlacesComponent`:

```ts
export class PlacesComponent {
  places = input.required<Place[]>();
  selectPlace = output<Place>();

  onSelectPlace() {
    this.selectPlace.emit(place); // emit to AvailablePlacesComponent!
  }
}
```

In `AvailablePlacesComponent` template listens to the `$event`, which is the clicked place object:

```html
<app-places [places]="places()!" (selectPlace)="onSelectPlace($event)" />
```

So, in `AvailablePlacesComponent`, its `onSelectPlace()` can log this `$event` i.e. `selectedPlace` as such:

```ts
  onSelectPlace(selectedPlace: Place) {
    console.log('=== AvailablePlacesComponent === onSelectPlace: ', selectedPlace);
```

Log in the Dev Tool > Console Tab:
```json
{
    "id": "p1",
    "title": "Forest Waterfall",
    "image": {
        "src": "forest-waterfall.jpg",
        "alt": "A tranquil forest with a cascading waterfall amidst greenery."
    },
    "lat": 44.5588,
    "lon": -80.344
}
```

Then, in `AvailablePlacesComponent`, I'm attaching a data object to the `put` request to the backend like this:

```ts
export class AvailablePlacesComponent implements OnInit{
   ...

  ngOnInit(): void {
   ...
  }

  onSelectPlace(selectedPlace: Place) {
    console.log('=== AvailablePlacesComponent === onSelectPlace: ', selectedPlace);
    this.httpClient.put('http://localhost:3000/user-places', {
      placeId: selectedPlace.id
    });
  }
}
```

There must be a `placeId` property in this request body which is in the JSON format, according to the `app.js` > `app.put("/user-places")`:

```ts
{
    placeId: selectedPlace.id
}
```

But now on UI, if I just click on any place card, the Dev Tool > Network Tab is not showing any new requests.

Coz I need to `subscribe` to the `this.httpClient.put()` request to trigger it!

If I don't care about the response of that put request, I can just stop here `.subscribe()`:

```ts
this.httpClient.put('http://localhost:3000/user-places', { 
    placeId: selectedPlace.id 
}).subscribe();
```

Or I can add an observer object, and define what will happen once the request is complete (`complete`), or when a new value is emitted from the observable like a `response` (`next`).

So I update the put request as such:

```ts
  onSelectPlace(selectedPlace: Place) {
    console.log('=== AvailablePlacesComponent === onSelectPlace: ', selectedPlace);

    this.httpClient.put('http://localhost:3000/user-places', { 
      placeId: selectedPlace.id 
    }).subscribe({
      next: (response) => console.log('User places:', response),
      complete: () => console.log('Place added to user places successfully.'),
    });
  }
```

Now I click on the place card, it prints this in the Dev Tool > Console Tab:

```
Place added to user places: 
{
    "userPlaces": [
        {
            "id": "p1",
            "title": "Forest Waterfall",
            "image": {
                "src": "forest-waterfall.jpg",
                "alt": "A tranquil forest with a cascading waterfall amidst greenery."
            },
            "lat": 44.5588,
            "lon": -80.344
        }
    ]
}

Place added to user places successfully.
```

In the Dev Tool > Network Tab, pop `user-places` open, where it shows the request url as `http://localhost:3000/user-places` with a request payload as `{placeId: "p1"}` and it gets a response, which is an object with a `userPlaces` as property.

And when there are multiple clicks on different place cards, the `userPlaces` array starts to grow:

```json
{
    "userPlaces": [
        {
            "id": "p1",
            "title": "Forest Waterfall",
            "image": {
                "src": "forest-waterfall.jpg",
                "alt": "A tranquil forest with a cascading waterfall amidst greenery."
            },
            "lat": 44.5588,
            "lon": -80.344
        },
        {
            "id": "p2",
            "title": "Sahara Desert Dunes",
            "image": {
                "src": "desert-dunes.jpg",
                "alt": "Golden dunes stretching to the horizon in the Sahara Desert."
            },
            "lat": 25,
            "lon": 0
        }
    ]
}
```

This put request's response is defined in `app.js`:

```js
app.put("/user-places", async (req, res) => {
  const placeId = req.body.placeId;

  const fileContent = await fs.readFile("./data/places.json");
  const placesData = JSON.parse(fileContent);

  const place = placesData.find((place) => place.id === placeId);

  const userPlacesFileContent = await fs.readFile("./data/user-places.json");
  const userPlacesData = JSON.parse(userPlacesFileContent);

  let updatedUserPlaces = userPlacesData;

  if (!userPlacesData.some((p) => p.id === place.id)) {
    updatedUserPlaces = [...userPlacesData, place];
  }

  await fs.writeFile(
    "./data/user-places.json",
    JSON.stringify(updatedUserPlaces)
  );

  res.status(200).json({ userPlaces: updatedUserPlaces });
});
```

![Project12-screenshot6](/01-starting-project-section-12/section12-demo/Project-12-2026-09-17-1.png)

Here are the tabs in the Dev Tool > Network Tab:

![Project12-screenshot7](/01-starting-project-section-12/section12-demo/Project-12-2026-09-17-2.png)

![Project12-screenshot8](/01-starting-project-section-12/section12-demo/Project-12-2026-09-17-3.png)

![Project12-screenshot9](/01-starting-project-section-12/section12-demo/Project-12-2026-09-17-4.png)

And `user-places.json` show the newly clicked-to-update object here:

```json
[{"id":"p1","title":"Forest Waterfall","image":{"src":"forest-waterfall.jpg","alt":"A tranquil forest with a cascading waterfall amidst greenery."},"lat":44.5588,"lon":-80.344}]
```

## More data fetching

Now, I want to show User's favorite places in the 'Your Favorite Places' box on UI.

So the `UserPlacesComponent` will have the new code - similar to `AvailablePlacesComponent`:

```ts
export class UserPlacesComponent {
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  isLoading = signal<boolean>(false);
  error = signal<string>('');

   ngOnInit(): void {
      this.isLoading.set(true);
      const subscription = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/user-places')
        .pipe(
          map(response => response.places),
          catchError(error => {
            console.log('Error fetching places:', error);
            return throwError(
              () => new Error('Failed to fetch your favorite places. Please try again later.')
            );
          })
        )
        .subscribe({
          next: places => {
            this.places.set(places);
          },
          error: (error: Error) => {
            this.error.set(error.message);
          },
          complete: () => this.isLoading.set(false),
        });
  
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
}
```

GET `/user-places` request in `app.js` will help me get the user's favorite places from `user-places.json`:

```js
app.get("/user-places", async (req, res) => {
  const fileContent = await fs.readFile("./data/user-places.json");

  const places = JSON.parse(fileContent);

  res.status(200).json({ places });
});
```

For example, if I click a few places cards in the `Available Places` box on UI, the `user-places.json` will look like this:

```json
[
    {
        "id":"p16",
        "title":"Victoria Falls",
        "image":{
            "src":"victoria-falls.jpg",
            "alt":"The powerful cascade of Victoria Falls, a natural wonder between Zambia and Zimbabwe."
        },
        "lat":-17.9243,
        "lon":25.8572
    },
    {
        "id":"p17",
        "title":"Machu Picchu",
        "image":{
            "src":"machu-picchu.jpg",
            "alt":"The historic Incan citadel of Machu Picchu illuminated by the morning sun."
        },
        "lat":-13.1631,
        "lon":-72.545
    }
]
``` 

They will show up in the UI like this:

![Project12-screenshot10](/01-starting-project-section-12/section12-demo/Project-12-2026-09-18-1.png)

Next, I will practice to outsource the shared logic into a service.

## Outsourcing HTTP Request Logic Into A Service

Update the existing `PlacesService` boilerplate code:

```ts
@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {}

  loadUserPlaces() {}

  addPlaceToUserPlaces(place: Place) {}

  removeUserPlace(place: Place) {}

  // added a private method to fetch places from the backend
  private fetchPlaces() {}
}
```

Grab the `this.httpClient.get()` from `UserPlacesComponent` - cut until right BEFORE the `.subscribe()` and put it in the `PlacesService`.

So `PlacesService` becomes:

```ts
@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {}

  loadUserPlaces() {}

  addPlaceToUserPlaces(place: Place) {}

  removeUserPlace(place: Place) {}

  // added a private method to fetch places from the backend
  private fetchPlaces() {
    this.httpClient.get<{ places: Place[] }>('http://localhost:3000/user-places')
        .pipe(
          map(response => response.places),
          catchError(error => {
            console.log('Error fetching places:', error);
            return throwError(
              () => new Error('Failed to fetch your favorite places. Please try again later.')
            );
          })
        )
  }
} 
```

Since `fetchPlaces()` is a private method, it's going to be called in `` and ``. 

Now it takes in the `url` and `errorMessage` these two params like this:

```ts
@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places', 'Failed to fetch available places. Please try again later.');
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places', 'Failed to fetch your favorite places. Please try again later.');
  }

  addPlaceToUserPlaces(place: Place) {}

  removeUserPlace(place: Place) {}

  // added a private method to fetch places from the backend, and use it in loadAvailablePlaces and loadUserPlaces
  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient.get<{ places: Place[] }>(url)
        .pipe(
          map(response => response.places),
          catchError(error => {
            console.log('Error fetching places:', error);
            return throwError(
              () => new Error(errorMessage)
            );
          })
        )
  }
}
```

Now, I can go to `AvailablePlacesComponent` and use this service's `loadAvailablePlaces` instead:

```ts
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  isLoading = signal<boolean>(false);
  error = signal<string>('');
  private placesService = inject(PlacesService);

  ngOnInit(): void {
    this.isLoading.set(true);
    const subscription = this.placesService.loadAvailablePlaces() // updated!
      .subscribe({        // better subscribe to the observable returned by loadAvailablePlaces in the component
        next: places => { // I can also easily update the UI based on the state of the observable
          this.places.set(places);
        },
        error: (error: Error) => {
          this.error.set(error.message);
        },
        complete: () => this.isLoading.set(false),
      });

    this.destroyRef.onDestroy(() => { // so that I can unsubscribe from the observable when the component is destroyed
      subscription.unsubscribe();
    });
  }
  ...
}
```

That's the reason why it's common to see the http configuration is set in the service whereas the subscription and un-subscription are defined in the component instead.

`loadAvailablePlaces()` looks like this in `PlacesService`:

```ts
@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places', 'Failed to fetch available places. Please try again later.');
  }

  // added a private method to fetch places from the backend, and use it in loadAvailablePlaces and loadUserPlaces
  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient.get<{ places: Place[] }>(url)
        .pipe(
          map(response => response.places),
          catchError(error => {
            console.log('Error fetching places:', error);
            return throwError(
              () => new Error(errorMessage)
            );
          })
        )
  }
}
```

I should also update the `onSelectPlace()` in the `AvailablePlacesComponent` like this:

```ts
export class AvailablePlacesComponent implements OnInit{
  ...

  onSelectPlace(selectedPlace: Place) {
    console.log('=== AvailablePlacesComponent === onSelectPlace: ', selectedPlace);
    this.placesService.addPlaceToUserPlaces(selectedPlace.id).subscribe({ // updated! Only passing the place id into addPlaceToUserPlaces
      next: (response) => console.log('User places:', response),
      complete: () => console.log('Place added to user places successfully.'),
    });
  }
}
```

`addPlaceToUserPlaces()` looks like this in `PlacesService`:

```ts
@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private httpClient = inject(HttpClient);

  addPlaceToUserPlaces(placeId: string) {
    return this.httpClient.put('http://localhost:3000/user-places', { 
      placeId: placeId // I can also just write placeId as the key and value are having the same name
    })
  }
}
```

Just notice that I should also clean up the subscription in the `onSelectPlace()` in the `AvailablePlacesComponent`:

```ts
export class AvailablePlacesComponent implements OnInit{
  ...
  private destroyRef = inject(DestroyRef);
  private placesService = inject(PlacesService);

  ngOnInit(): void {
    ...
  }

  onSelectPlace(selectedPlace: Place) {
    console.log('=== AvailablePlacesComponent === onSelectPlace: ', selectedPlace);

    const subscription = this.placesService.addPlaceToUserPlaces(selectedPlace.id).subscribe({
      next: (response) => console.log('User places:', response),
      complete: () => console.log('Place added to user places successfully.'),
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
```


Finally, `UserPlacesComponent` and its `onSelectPlace()` becomes:

```ts
export class UserPlacesComponent {
  places = signal<Place[] | undefined>(undefined);
  private destroyRef = inject(DestroyRef);
  isLoading = signal<boolean>(false);
  error = signal<string>('');
  private placesService = inject(PlacesService);

   ngOnInit(): void {
      this.isLoading.set(true);
      const subscription = this.placesService.loadUserPlaces() // updated!
        .subscribe({
          next: places => {
            this.places.set(places);
          },
          error: (error: Error) => {
            this.error.set(error.message);
          },
          complete: () => this.isLoading.set(false),
        });
  
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
}
``` 

So eventually I'm using the `placesService` to fetch data and components only need to control the UI display.

## Managing HTTP-loaded Data via a Service

In `UserPlacesComponent`, instead of fetching data there and then managing the signal state of `places` in the component, move it to `PlacesService`.

For example, in `PlacesService`, there is `userPlaces` and it's exposed as a read-only signal as the below.

And I learned to use `tap` to update the `userPlaces` signal after it's fetched from `fetchPlaces()`.

Note:
- `pipe`: I can pipe here again even though I already piped in fetchPlaces, because the return value of fetchPlaces is an observable
- `tap`: I can update the userPlaces signal with the fetched user places without subscribing here

```ts
@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadUserPlaces() {
    return this.fetchPlaces(
      'http://localhost:3000/user-places', 
      'Failed to fetch your favorite places. Please try again later.'
    ).pipe( // I can pipe here again even though I already piped in fetchPlaces
      tap({
        next: (userPlaces) => this.userPlaces.set(userPlaces), // I can update the userPlaces signal without subscribing here
      })
    );
  } 
...
}
```

Then, in `UserPlacesComponent`, I can replace the existing `places` signal in the `UserPlacesComponent` with the one from `PlacesService`, i.e. `this.placesService.loadedUserPlaces` so that now in the `UserPlacesComponent`, I only need to deal with the `error` and `complete` state of the fetched data: 

```ts
export class UserPlacesComponent {
  // places = signal<Place[] | undefined>(undefined); // this is replaced by the loadedUserPlaces signal in the PlacesService
  private destroyRef = inject(DestroyRef);
  isLoading = signal<boolean>(false);
  error = signal<string>('');
  private placesService = inject(PlacesService);
  places = this.placesService.loadedUserPlaces; // loadedUserPlaces is a readonly signal, so I can use it directly in the template without worrying about accidentally modifying it

   ngOnInit(): void {
      this.isLoading.set(true);
      const subscription = this.placesService.loadUserPlaces()
        .subscribe({
          // I don't need to update the places signal here because I already updated it in the PlacesService i.e. loadUserPlaces
          // next: places => {
          //   this.places.set(places);
          // },
          error: (error: Error) => {
            this.error.set(error.message);
          },
          complete: () => this.isLoading.set(false),
        });
  
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
}
```

## Implementing Optimistic Updating

Currently when User clicks a `Place` card in the `Available Places`, the `Place` card indeed get added into the `user-places.json`, but it doesn't show up in the `Your Favorite Places` on the UI.

I can do this to make sure all the places in the app that's using `userPlaces` in the `PlacesService` (i.e. `UserPlacesComponent`) got the latest version of it when one place in the app (i.e. `AvailablePlacesComponent`) triggered `addPlaceToUserPlaces`:

In `PlacesService`;

```ts
// old
addPlaceToUserPlaces(placeId: string) {
    return this.httpClient.put('http://localhost:3000/user-places', { 
        placeId: placeId 
    })
}

// new
addPlaceToUserPlaces(place: Place) {
    this.userPlaces.update(prevPlaces => [...prevPlaces, place]); // update the userPlaces signal with the new place

    return this.httpClient.put('http://localhost:3000/user-places', {
        placeId: place.id,
    });
}
```

In `AvailablePlacesComponent` I can just pass the entire `selectedPlace` into `this.placesService.addPlaceToUserPlaces()`:

```ts
onSelectPlace(selectedPlace: Place) {
    console.log('=== AvailablePlacesComponent === onSelectPlace: ', selectedPlace);

    const subscription = this.placesService.addPlaceToUserPlaces(selectedPlace).subscribe({ // updated!
        next: (response) => console.log('User places:', response),
        complete: () => console.log('Place added to user places successfully.'),
    });

    this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
    });
}
```

Now it looks like this once User clicks `Caribbean Beach`:

![Project12-screenshot11](/01-starting-project-section-12/section12-demo/Project-12-2026-09-21-1.png)