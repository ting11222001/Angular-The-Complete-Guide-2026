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