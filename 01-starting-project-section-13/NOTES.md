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

## Getting Access to the Angular-Managed Form

Till this point, I haven't had access to this Angular managed form in the component yet.

So, my next step is to add a template variable, `#form`, which will give me access to the HTML form element.

Then, because of the `FormsModule` imported to the component, I can use `ngForm` identifer which is offered by the `FormsModule`'s form directive, and it will bind this form template variable, `#form` to an object of type `NgForm`, and this object is automatically created and managed by Angular:

![Project13-screenshot3](/01-starting-project-section-13/section13-demo/Project-13-2026-09-29-1.png)

So, the `LoginComponent` template will be like this:

```html
<form #form="ngForm">
  <h2>Login</h2>

  <div class="control-row">
    <div class="control no-margin">
      <label for="email">Email</label>
      <input id="email" type="email" name="email" ngModel />
    </div>

    <div class="control no-margin">
      <label for="password">Password</label>
      <input id="password" type="password" name="password" ngModel />
    </div>

    <button class="button">Login</button>
  </div>
</form>
```

So now, this `#form` template variable stores this Angular managed form. The inputs are registered to this object `NgForm` object by `ngModel`.

The reason why it's called template-driven is because I need all these setup work in the template.

Then, in the component, to access this form, I can either use the view child function or decorator or by passing this variable, `#form`, onto some method that will be executed when the form is submitted.

Here I'm learning the second approach, i.e. adding the `ngSubmit` event handler, which is another forms related feature offered by Angular.

Pass a `form` of `NgForm` type to the `onSubmit`:

```html
<form #form="ngForm" (ngSubmit)="onSubmit(form)"> <--- here!
  <h2>Login</h2>

  <div class="control-row">
    <div class="control no-margin">
      <label for="email">Email</label>
      <input id="email" type="email" name="email" ngModel />
    </div>

    <div class="control no-margin">
      <label for="password">Password</label>
      <input id="password" type="password" name="password" ngModel />
    </div>

    <button class="button">Login</button>
  </div>
</form>

```

Then in the `LoginComponent`:

```ts
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  onSubmit(form: NgForm) {
    console.log(form);
  }
}
```

Here's the result of `console.log(form);`:

![Project13-screenshot4](/01-starting-project-section-13/section13-demo/Project-13-2026-09-29-2.png)

I can tell it's a `NgForm` object with a `form` key and it holds another object of type `FormGroup`.

This `FormGroup` contains some properties like `controls`, `errors` (which is currently `null`), `pristine` (which is currently `false`, and `touched: true`, so it has has been touched by the user), `value` (which has two keys that match the names of `<input name="email" />` and `<input name="password" />`. This proves that `ngModel` does register these inputs to this form).


![Project13-screenshot5](/01-starting-project-section-13/section13-demo/Project-13-2026-09-29-3.png)

If I expand `controls`, I can see each key-value pair is for each input we registered. These keys have the same names as in the `<input name="email" />` and `<input name="password" />`. Each key is of type `FormControl`. Then, for each input I can see more detailed info like `value` (i.e. the value User just entered), `status` (like if it's `VALID`), `touched` (like if it's touched by the user), etc.

![Project13-screenshot6](/01-starting-project-section-13/section13-demo/Project-13-2026-09-29-4.png)

The `value` of the form is captured in this `NgForm`:

![Project13-screenshot7](/01-starting-project-section-13/section13-demo/Project-13-2026-09-29-5.png)