# NOTES

This is a place where I go through each module of the course and take the notes.

## Getting Started

### Creating A New Angular Project

Install Angular CLI, run:
```bash
npm install -g @angular/cli
```

Create a new Angular project:
```bash
ng new <project name> --no-zoneless
```

This is what I run for the course:
```bash
ng new first-angular-app --no-zoneless
```

`--no-zoneless` is used for Angular version >= 20.

Then chose:
```
- css styling 
- no server side rendering
```

### Setting Up An Angular Development Environment

Extensions installed on VS code:
```
- Angular Language Service
- Angular Essentials (Version 20) by John Papa
```

Run this to see what's the app like currently:
```bash
cd first-angular-app/
npm start
```

Go to Local: http://localhost:4200/

Keep the dev server up and running when making code changes. It will recompile on the spot.

## Angular Essentials - Components, Templates, Services & More

### A New Starting Project & Analyzing The Project Structure

`tsconfig` files are for TypeScript configuration. Normally I don't need to do anything to them.

`package` files are for dependencies/packages I need to use in this project.

`angular.json` is for extra settings for Angular CLI. Normally I don't need to do anything to it.

Go into the project folder and run `npm install` to have all the dependencies. As long as it finishes without error, then it's good to go.

Then, run `npm start` which will run `ng serve` from Angular CLI under the hood.

Go to Local: http://localhost:4200/ in the browser.

Right click and select `view page source`, I can see:
```
<script src="polyfills.js" type="module"></script><script src="main.js" type="module"></script></body>
```

The `main.js` is acutally from `main.ts` which is compiled by the CLI tool:
```ts
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent).catch((err) => console.error(err));
```

The `AppComponent` is actually from `app.component.ts`. The imported path doesn't need to have `.ts` in the typescript file. This is a component which can been as a custome HTML element.

```ts
// app.component.ts
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
```

`@Component` is called a decorator. It's a TypeScript feature which gives some metadata to the class `AppComponent`.

The passed in configuration object has several properties. For example, `selector: 'app-root',` this tells Angular which HTML element can be replaced by this component and its markup. The markup of this component is stored in `templateUrl: './app.component.html',`.

```html
<!-- app.component.html -->
<header>
  <img src="assets/angular-logo.png" alt="The Angular logo: The letter 'A'" />
  <h1>Let's get started!</h1>
  <p>Time to learn all about Angular!</p>
</header>
```

The `AppComponent` will then render in `index.html` at `<app-root></app-root>` line:
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Essentials</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

#### Fixing `tsconfig.json`

##### Add `"rootDir": "./src",` under `"outDir": "./dist/out-tsc",`

TypeScript needs to know where your source files start, so it can build the correct folder structure inside the output folder. Without `rootDir`, TypeScript has to guess this from your files, and it warns you when the guess is not certain.

Your source files live under `./src`. Setting `rootDir` to `./src` tells TypeScript this directly, so the warning goes away and the output folder structure stays correct.

##### Update `"moduleResolution": "node",` to `"moduleResolution": "bundler",`

The value `"node"` is being renamed to "node10", and it is marked as deprecated. It will stop working in TypeScript 7.0.

Angular's build tool, starting from Angular CLI 17, uses esbuild. The `"bundler"` option matches how esbuild resolves modules, so it is the setting that fits your current build process. It also allows relative imports without file extensions, which matches your existing code style.

### Creating a First Custom Component

Create `HeaderComponent`.

If using Angular 19+ then I don't need to manually set `standalone: true,`.

### Using the Custom Component

To see the `HeaderComponent` on screen, I can't just add it to the `index.html` like this:
```html
<body>
  <app-header></app-header>
  <app-root></app-root>
</body>
```

I need to add this here in `main.ts` too as Angular won't automatically scan all the files and register my components:
```ts
bootstrapApplication(HeaderComponent);
``` 

But eventually I should create a tree of components:
```
One Angular Application = One Component Tree
```

So I can just move `HeaderComponent` into the `AppComponent` like this:
```html
<!-- app.component.html -->
<app-header></app-header>
```

And use `imports` array in the configuration of `@Component`:
```ts
// AppComponent
import { Component } from '@angular/core';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
```

And keep `index.html` as before:
```html
<body>
  <app-root></app-root>
</body>
```

And keep `main.ts` as before:
```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent).catch((err) => console.error(err));
```

### Styling the Header Component & Adding An Image