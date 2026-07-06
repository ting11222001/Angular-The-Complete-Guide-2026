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

Add `styleUrl` to the `@Component`.

Also updated `styles.css`, `header.component.css` and `index.html` with the new font links.

Note that in `angular.json` here it needs to specify where the images are:
```json
"assets": [
    "src/favicon.ico",
    "src/assets"
],
```

### Managing & Creating Components with the Angular CLI

Create a `header` folder under `app` to put in all the header component related files.

Once moved, I can see `AppComponent`'s `HeaderComponent` import is updated:
```ts
import { HeaderComponent } from './header/header.component';
```

Then, use Angular CLI to create new component, `UserComponent`.

```bash
cd 01-starting-project
ng g c user
```

It will automatically generate these files:
```bash
CREATE src/app/user/user.component.html (20 bytes)
CREATE src/app/user/user.component.spec.ts (601 bytes)
CREATE src/app/user/user.component.ts (238 bytes)
CREATE src/app/user/user.component.css (0 bytes)
```

I can remove `spec.ts` file as it's for automated testing later.

###  Styling & Using Our Next Custom Component

Key things:

- I can use self-closing tag like this:
```html
<app-header />
```

- Added `UserComponent` to `AppComponent`:
```ts
import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, UserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
```

```html
<!-- app.component.html -->
<app-header />

<main>
    <ul id="users">
        <li>
            <app-user />
        </li>
    </ul>
</main>
```

- Updated `UserComponent`'s structure:
```html
<div>
    <button>
        <img />
        <span>NAME</span>
    </button>
</div>
```

### Preparing User Data (To Output Dynamic Content)

Added a new `user` folder with images in `assets` folder. Also, `dummy-user.ts` in the `app` folder.

### Storing Data in a Component Class

`selectedUser` (it's a public property belonged to the component class) will be accessible in the `user.component.html`.

`randomIndex` can be generated by `Math.random()` but it's choosing between 0 and 1 (excluding 1), so I also need to use `Math.floor()`.

```ts
import { Component } from '@angular/core';
import { DUMMY_USERS }  from '../dummy-users';

const randomUserIndex = Math.floor(Math.random() * DUMMY_USERS.length);

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  selectedUser = DUMMY_USERS[randomUserIndex]; // selectedUser is a public property
}
```

#### How to design `randomUserIndex` from scratch

Step 1: Write down what you actually want

You want a random position in the array. Positions in an array are called indexes. For an array of 5 items, the valid indexes are 0, 1, 2, 3, 4. Notice it starts at 0 and stops at one below the length.

So your goal in plain words: "give me a random whole number from 0 to (length minus 1)".

Step 2: Find out what random tool you have

In JavaScript the only built in random tool is `Math.random()`.

```ts
Math.random(); // e.g. 0.0, 0.42, 0.87, 0.999
```

Step 3: Fix the range first

You want the range to reach up to your array size. Right now it reaches up to 1. To stretch a 0-to-1 range so it reaches up to 5, you multiply by 5. And 5 is just the array length.

```ts
Math.random() * DUMMY_USERS.length; // e.g. 0.0, 2.1, 4.35, 4.99
```

Step 4: Fix the decimal problem last

You still have decimals like 4.35. You need whole numbers. You have three rounding tools, so you ask which one keeps you in range.

`Math.floor` rounds down, so 4.99 becomes 4. Your range becomes 0 to 4. That is exactly the valid indexes.

`Math.ceil` rounds up, so 0.1 becomes 1 and 4.99 becomes 5. But 5 is out of range. Bad.

`Math.round` rounds to nearest, which can also give you 5. Bad.

### Outputting Dynamic Content with String Interpolation

```html
<!-- user.component.html -->
 <div>
    <button>
        <img />
        <span>{{ selectedUser.name }}</span>
    </button>
</div>
```

### Property Binding & Outputting Computed Values