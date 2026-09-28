# NOTES

This is a place where I take notes for the practice project of the section 13 of the course, `Handling User Input & Working with Forms (Tempalte-driven & Reactive)`.

## Setup the Starting Project

Follow what I did for the section 9 exercise.

Then, run `npm install`, and then `npm start` for the main project folder of this section, which is the angular app folder.

Its branch is `app-forms`.

I also created a folder for screenshots of this app practice, `section13-demo`.

## The starting projects: frontend & backend

There are two ways in Angular that handles forms: template-driven and reactive.

I will practice how to manage inputs like extracting those values and validating them.

Run up the angular app by `npm start` in the main project folder of this section.

![Project13-screenshot1](/01-starting-project-section-13/section13-demo/Project-13-2026-09-26-1.png)

## Template-driven vs Reactive Forms

`Template-driven`: setting up the form with the help of the component templates and register inputs with Angular. Easy to get started with but more limitations when the form gets complicated.

`Reactive Forms`: setting up the form structure in my TypeScript code. Then, link that to the template elements, so Angular can be aware of which element is linked to which control in my TypeScript code. More verbose code on setup, but able to handle more complex forms.

## Template-driven: Registering Form Controls

The goal is to make Angular aware of this form `LoginComponent` template and its inputs, so that Angular will provide some features via some directives to allow me to easily interact with this form.

For example, extract the entered values, etc.

For example, start with making Angular aware of this email input field, `<input id="email" type="email" />`.

This `ngModel` without two-way binding is registering an input element (e.g. `<input />`, `<textarea />`, `<select />`, etc. any HTML elements that are gathering user inputs) with Angular, so Angular can manage this `<input id="email" type="email" />` behind the scenes, and I will gain access to this element.

So, in this `LoginComponent` template:

```html
<form>
  <h2>Login</h2>

  <div class="control-row">
    <div class="control no-margin">
      <label for="email">Email</label>
      <input id="email" type="email" ngModel/> <--- here!
    </div>

    <div class="control no-margin">
      <label for="password">Password</label>
      <input id="password" type="password" />
    </div>

    <button class="button">Login</button>
  </div>
</form>
```

And to make `ngModel` work, add `FormsModule` to this `imports` array:

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {}
```

So this `imports: [FormsModule],` unlocks the `ngModel` directive and some other form related features too.

When I go back to the website, I can see this error:

```
main.ts:5 ERROR RuntimeError: NG01352: If ngModel is used within a form tag, either the name attribute must be set or the form control must be defined as 'standalone' in ngModelOptions.
```

![Project13-screenshot2](/01-starting-project-section-13/section13-demo/Project-13-2026-09-26-2.png)

So looking at the template again, I'm using `ngModel` in a `form` tag but the `input` element doesn't have the `name` attribute set on it.

So, update this:

```html
<!-- old -->
<input id="email" type="email" ngModel/>

<!-- new -->
<input id="email" type="email" name="email" ngModel/>
```

Angular will use that `name` attribute to register this `input` element and to manage it.

Then the previous error message went away.

So do the same to the second input, i.e. the password:

```html
<form>
  <h2>Login</h2>

  <div class="control-row">
    <div class="control no-margin">
      <label for="email">Email</label>
      <input id="email" type="email" name="email" ngModel /> <--- here!
    </div>

    <div class="control no-margin">
      <label for="password">Password</label>
      <input id="password" type="password" name="password" ngModel /> <--- here!
    </div>

    <button class="button">Login</button>
  </div>
</form>
```