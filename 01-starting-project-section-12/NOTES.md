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