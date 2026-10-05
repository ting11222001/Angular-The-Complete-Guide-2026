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

## Extracting User Input Values

Now I can access the entered values by using the keys of the `NgForm` object:

```ts
export class LoginComponent {
  onSubmit(formData: NgForm) {  // change the param name from 'form' to 'formData'
    const entertedEmail = formData.form.value.email; // so here I can say 'formData.form.xx' instead of `form.form.xx` for this practice
    const entertedPassword = formData.form.value.password;
    console.log('entertedEmail: ', entertedEmail);
    console.log('entertedPassword: ', entertedPassword);
  }
}
```

Bascially I'm not using two-binding (as in the template it's just `ngModel`, not `[(ngModel)]`) and just get hold of the entered value when the form is submitted with Angular's created form object, `formData`.

## Validating input with form validation directives

For example, `required`, so Angular knows this input field must not be empty.

Also, `email` attribute is also registered as a directive.

Update the `LoginComponent` template:

```html
<form #form="ngForm" (ngSubmit)="onSubmit(form)">
  <h2>Login</h2>

  <div class="control-row">
    <div class="control no-margin">
      <label for="email">Email</label>
      <input id="email" type="email" name="email" ngModel required email />
    </div>

    <div class="control no-margin">
      <label for="password">Password</label>
      <input id="password" type="password" name="password" ngModel required minlength="6" />
    </div>

    <button class="button">Login</button>
  </div>
</form>
```

After adding those directives and then add `console.log(formData.form);` here in the `LoginComponent`, now open the log in form with empty fields, I can see the `status` has become `invalid` currently for the entire `form` object:

![Project13-screenshot8](/01-starting-project-section-13/section13-demo/Project-13-2026-09-30-1.png)

Pop the `email` control open, the `status` is also `invalid`, and the `errors` says `{required: true}`:

![Project13-screenshot9](/01-starting-project-section-13/section13-demo/Project-13-2026-09-30-2.png)

If I fill `email` with some text like `test`, then the `errors` says `{email: true}` but the status is still `invalid` as it's still not an email:

![Project13-screenshot10](/01-starting-project-section-13/section13-demo/Project-13-2026-09-30-3.png)

Then, I can add a boolean check in the `LoginComponent` where I check if the entire `form` object is `invalid`, then when submit, just `return;`:

```ts
export class LoginComponent {
  onSubmit(formData: NgForm) {
    if (formData.form.invalid) {
      return;
    }
    const entertedEmail = formData.form.value.email;
    const entertedPassword = formData.form.value.password;

    console.log('formData.form: ', formData.form);
    console.log('entertedEmail: ', entertedEmail);
    console.log('entertedPassword: ', entertedPassword);
  }
}
```

![Project13-screenshot11](/01-starting-project-section-13/section13-demo/Project-13-2026-09-30-4.png)

Then, now if I click `submit` when the fields are empty, the dev tool > console tab will not print anything as the code has been exited:

![Project13-screenshot12](/01-starting-project-section-13/section13-demo/Project-13-2026-09-30-5.png)

## Using the Form Validation Status To Provide User Feedback

Add the `<p />` tag with class `control-error`.

Add `@if (form.form.invalid)`. The first `form` is from `#form` reference, and the second `form` is the `form` key in the `NgForm` object.

```html
<form #form="ngForm" (ngSubmit)="onSubmit(form)">
  <h2>Login</h2>

  <div class="control-row">
    <div class="control no-margin">
      <label for="email">Email</label>
      <input id="email" type="email" name="email" ngModel required email />
    </div>

    <div class="control no-margin">
      <label for="password">Password</label>
      <input id="password" type="password" name="password" ngModel required minlength="6" />
    </div>

    <button class="button">Login</button>
  </div>

  @if (form.form.invalid) {
    <p class="control-error">
      Invalid values detected.
    </p>  
  }
</form>
```

So now on UI, if email and password fields are empty i.e. form status is invalid, then it will show this error message nicely:

![Project13-screenshot13](/01-starting-project-section-13/section13-demo/Project-13-2026-10-01-1.png)

But this is not the best user experience as this error message only shows up after submitting (clicking the Log in button), so user didn't have a chance to change their inputs.

Change it to `form.form.touched && form.form.invalid`, so that before the login button is clicked, user needs to at least had touched the fields (even without filling in any values):

```html
@if (form.form.touched && form.form.invalid) {
    <p class="control-error">
        Invalid values detected.
    </p>  
}
```

To be more specific, check each controls field like this:

```html
  @if (form.form.controls['email'].touched && 
    form.form.controls['password'].touched && 
    form.form.invalid) {
    <p class="control-error">
      Invalid values detected.
    </p>  
  }
```

So only when User had tried to fill in both fields, then the `Invalid values detected.` message will be shown on the UI.

### `form.form.touched` vs `form.form.controls['email'].touched`

The difference is scope: one checks the whole form, the other checks one field.

`form.form.touched`

- `form` is your `NgForm` (from `#form="ngForm"`).
- `form.form` is the `FormGroup` behind it.
- It becomes `true` as soon as any field in the form has been touched.

`form.form.controls['email'].touched`

- This is the single `FormControl` for the `email` field.
- It becomes `true` only when the email field itself has been touched.

"Touched" means the user focused the field and then left it (a blur event). Typing alone does not set it until the user leaves the field.

Then, back to the course content.

`#email` means we want to store this `ngModel` control object into this `#email` template variable.

Hovering over `#email` I can see this is a reference of `ngModel` type.

So now I can simplify this part into this:

```html
<!-- old -->
@if (form.form.controls['email'].touched && 
    form.form.controls['password'].touched && 
    form.form.invalid) {
    <p class="control-error">
        Invalid values detected.
    </p>  
}

<!-- new -->
@if (
    email.touched &&
    password.touched &&
    form.form.invalid
) {
    <p class="control-error">Invalid values detected.</p>
}
```

Again on the UI, if I tap on the email field, and then tap out, the error message will not show, but then if I tap on the password field, and then tap out, the error message will show this time without clicking on the login i.e. `onSubmit()` button.

The key of this template driven approach is that we can get this control specific info by using `email.touched` and `password.touched`, as well as the entire `form` info by using `form.form.invalid`.

## Adding Validation Styles

Check the element of email input field in the dev tool.

`class="ng-pristine ng-invalid ng-touched"` is added and managed by Angular thanks to `ngModel` added to that `<input />`.

Since I didn't type anything yet in the email field, it's pristine, but touched as I clicked on it, and no text in there so it's invalid.

```html
<input _ngcontent-ng-c2979662422="" id="email" type="email" name="email" ngmodel="" required="" email="" ng-reflect-required="" ng-reflect-email="" ng-reflect-name="email" ng-reflect-model="" class="ng-pristine ng-invalid ng-touched">
```

If then I reloaded the page, the `<input />` class becomes `ng-untouched`:

```html
<input _ngcontent-ng-c2979662422="" id="email" type="email" name="email" ngmodel="" required="" email="" ng-reflect-required="" ng-reflect-email="" ng-reflect-name="email" ng-reflect-model="" class="ng-untouched ng-pristine ng-invalid">
```

I can use this `class` for styling e.g. in `styles.css` like this:

```css
.control:has(input.ng-invalid.ng-touched.ng-dirty) label {
  color: #f98b75;
}

input.ng-invalid.ng-touched.ng-dirty {
  background-color: #fbdcd6;
  border-color: #f98b75;
}
```

So now if I randomly type something invalid in the input fields of email and password, then the fields becomes dirty, and now if I tap out, the fields change colours accordingly:

![Project13-screenshot14](/01-starting-project-section-13/section13-demo/Project-13-2026-10-02-1.png)

I can also update the error message styles according to the fields like this:

```html
<form #form="ngForm" (ngSubmit)="onSubmit(form)">
  <h2>Login</h2>

  <div class="control-row">
    <div class="control no-margin">
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        name="email"
        ngModel
        required
        email
        #email="ngModel"
      />
    </div>

    <div class="control no-margin">
      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        name="password"
        ngModel
        required
        minlength="6"
        #password="ngModel"
      />
    </div>

    <button class="button">Login</button>
  </div>

  @if (
    email.touched &&
    email.dirty &&
    email.invalid
  ) {
    <p class="control-error">Invalid email address entered.</p>
  }

  @if (
    password.touched &&
    password.dirty &&
    password.invalid
  ) {
    <p class="control-error">Invalid password entered. Password must be at least 6 characters long.</p>
  }
</form>
```

So now if I input invalid email and password and tap out, I can see the error messages accordingly:

![Project13-screenshot15](/01-starting-project-section-13/section13-demo/Project-13-2026-10-02-2.png)

If I then enter valid values, then the error messages are gone, and I can submit the form and access the value there (from the `LogInComponent` and its `onSubmit()` method when the form is NOT invalid):

![Project13-screenshot16](/01-starting-project-section-13/section13-demo/Project-13-2026-10-02-3.png)

## Interacting With The Underlying Form Object In The Component

I can use this `formData.form.reset()` to clear out the values and reset all the underlying info:

```ts
export class LoginComponent {
  onSubmit(formData: NgForm) {
    if (formData.form.invalid) {
      return;
    }
    const entertedEmail = formData.form.value.email;
    const entertedPassword = formData.form.value.password;

    console.log('formData: ', formData);
    console.log('formData.form: ', formData.form);
    console.log('entertedEmail: ', entertedEmail);
    console.log('entertedPassword: ', entertedPassword);

    formData.form.reset(); // clear out the values and reset all the underlying info
  }
}
```

So now if I type in valid email and 6 characters long password and then click log in, then the fields are cleared and console logs run from `onSubmit()`, and the fields are cleared with `class="ng-untouched ng-pristine ng-invalid">` in the `input` tag:

![Project13-screenshot17](/01-starting-project-section-13/section13-demo/Project-13-2026-10-02-4.png)


To wrap up this template driven approach, I'm adding some extra features to this form.

For example, if User enters some values in the email field, but halfway User reloads the page, I want to save that value and pre-populate the form with that saved value.

So I will have to save the value while User is entering it.

I need to do it outside of the `onSubmit()` or it will be too late.

Use `viewChild` to link to the Angular form. Set it as `required`, so in `this.form().valueChanges?.subscribe()`, I don't need to write `this.form()?`.

`valueChanges` returns an observable and can be `null`, so it's `valueChanges?`.

`afterNextRender()` means `Register a callback to be invoked the next time the application finishes rendering`. 

```ts
export class LoginComponent {
  private form = viewChild.required<NgForm>('form'); // added!
  private destroyRef = inject(DestroyRef); // added!

  constructor() {  // added!
    afterNextRender(() => {  // added!
      const subscription = this.form().valueChanges?.subscribe({  // added!
        next: (value) => console.log(value)   // added!
      });

      this.destroyRef.onDestroy(() => subscription?.unsubscribe());  // added!
    });
  }
  ...
}
```

![Project13-screenshot18](/01-starting-project-section-13/section13-demo/Project-13-2026-10-02-5.png)

I'm only doing thfis temporary save thing in the local storage o my browser.

```ts
export class LoginComponent {
  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const subscription = this.form().valueChanges?.subscribe({
        next: (value) =>
          window.localStorage.setItem(
            'saved-login-form',
            JSON.stringify({ email: value.email }),
          ),
      });

      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
    });
  }
}
```

So now with every keystroke, each character of the email input field will be saved in the `saved-login-form` row in the localStorage.

Start with empty:

![Project13-screenshot19](/01-starting-project-section-13/section13-demo/Project-13-2026-10-02-6.png)

Then, start with filling in:

![Project13-screenshot20](/01-starting-project-section-13/section13-demo/Project-13-2026-10-02-7.png)

![Project13-screenshot21](/01-starting-project-section-13/section13-demo/Project-13-2026-10-02-8.png)

This might not be performant.

So I can add a `pipe()` to introduce `debounceTime()` operator, which takes a milliseconds as param, so if User is still typing it won't emit the value yet. Only when User stops for at least 500 milliseconds the emitted value will make it to this `next()` function.

So the `next()` function won't run too often.

```ts
export class LoginComponent {
  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const subscription = this.form()
        .valueChanges?.pipe(debounceTime(500))
        .subscribe({
          next: (value) =>
            window.localStorage.setItem(
              'saved-login-form',
              JSON.stringify({ email: value.email }),
            ),
        });

      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
    });
  }
  ...
}
```

On the UI, if I keep typing it won't update the localStorage right away - only when I stop for a bit, then it will start updating the localStorage to wherever I stop typing with.

## Updating Form Values Programmatically

Now I want to use that saved email value to pre-populate the form.

If I use this `s.form().controls['email'].setValue(savedEmail);` directly, it shows this error `ERROR TypeError: Cannot read properties of undefined (reading 'setValue')`:

```ts
export class LoginComponent {
  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const savedFormData = window.localStorage.getItem('saved-login-form');

      if (savedFormData) {
        const loadedFormData = JSON.parse(savedFormData);
        const savedEmail = loadedFormData.email;
        this.form().controls['email'].setValue(savedEmail); // error!
      }
      ...
    }
```

### `ERROR TypeError: Cannot read properties of undefined (reading 'setValue')`

The `email` control does not exist yet when your callback runs. That is why `controls['email']` is `undefined` and `.setValue()` throws.

#### Why it happens

You are using a template driven form (`NgForm` with `ngModel`). In this type of form, each `ngModel` input does not add its control to the form straight away. `NgForm.addControl()` puts the registration inside a resolved Promise. So it runs a moment later, in the next microtask.

`afterNextRender()` runs right after the DOM is rendered. At that point the inputs exist on the page, but their controls are still waiting to be added. So `this.form().controls` is an empty object `{}`.

#### How to solve it

In this tutorial, I learned to wait one more tick (smallest change):

```ts
afterNextRender(() => {
  const savedFormData = window.localStorage.getItem('saved-login-form');

  if (savedFormData) {
    const loadedFormData = JSON.parse(savedFormData);
    setTimeout(() => { // added!
      this.form().controls['email'].setValue(loadedFormData.email);
    }, 1);
  }
});
```

Reason: `setTimeout` runs after all pending microtasks, so the controls are registered by then. It works, but it depends on timing, which is a bit fragile.

So now if I type in the email field up to `test@`, it will be saved in the local storage and then reload the page, the email field is pre-populated upto `test@` automatically:

![Project13-screenshot22](/01-starting-project-section-13/section13-demo/Project-13-2026-10-02-9.png)

But I will learn more elegant way i.e. Reactive Form in the next course module, which I don't need to add a workaround `setTimeout`.

## Reactive Forms: Getting Started

Reset the template and the component for `Login`.

So the previous template driven approach the `Login` component looks like this:

```ts
import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  viewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const savedFormData = window.localStorage.getItem('saved-login-form');

      if (savedFormData) {
        const loadedFormData = JSON.parse(savedFormData);
        const savedEmail = loadedFormData.email;

        setTimeout(() => {
          this.form().controls['email'].setValue(savedEmail);
        }, 1);
      }

      const subscription = this.form()
        .valueChanges?.pipe(debounceTime(500))
        .subscribe({
          next: (value) =>
            window.localStorage.setItem(
              'saved-login-form',
              JSON.stringify({ email: value.email }),
            ),
        });

      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
    });
  }

  onSubmit(formData: NgForm) {
    if (formData.form.invalid) {
      return;
    }
    const entertedEmail = formData.form.value.email;
    const entertedPassword = formData.form.value.password;

    console.log('formData: ', formData);
    console.log('formData.form: ', formData.form);
    console.log('entertedEmail: ', entertedEmail);
    console.log('entertedPassword: ', entertedPassword);

    formData.form.reset(); // clear out the values and reset all the underlying info
  }
}
```

The previous `Login` template looks like this:

```html
<form #form="ngForm" (ngSubmit)="onSubmit(form)">
  <h2>Login</h2>

  <div class="control-row">
    <div class="control no-margin">
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        name="email"
        ngModel
        required
        email
        #email="ngModel"
      />
    </div>

    <div class="control no-margin">
      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        name="password"
        ngModel
        required
        minlength="6"
        #password="ngModel"
      />
    </div>

    <button class="button">Login</button>
  </div>

  @if (
    email.touched &&
    email.dirty &&
    email.invalid
  ) {
    <p class="control-error">Invalid email address entered.</p>
  }

  @if (
    password.touched &&
    password.dirty &&
    password.invalid
  ) {
    <p class="control-error">Invalid password entered. Password must be at least 6 characters long.</p>
  }
</form>
```

Now `LoginComponent` is clean like this:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {}
```

And the `LoginComponent` template is like this:

```html
<form>
  <h2>Login</h2>

  <div class="control-row">
    <div class="control no-margin">
      <label for="email">Email</label>
      <input id="email" type="email" />
    </div>

    <div class="control no-margin">
      <label for="password">Password</label>
      <input id="password" type="password" />
    </div>

    <button class="button">Login</button>
  </div>
</form>
```

Later, other than making login form, I will also practice the sign up form.

Start with the login form using Reactive Forms approach.

I don't need to set up anything in the template. Instead, I only need to do that in the TypeScript code in the template. 

Earlier in the template driven approach, Angular creates a form object of type `FormGroup`. In the reactive form approach, we create a form object of type `FormGroup` ourselves.

`FormGroup` takes an object as an input and that object will register multiple key value pairs where every key value pair represents one control inside of that `FormGroup` or some nested `FormGroup`. 

```ts
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form = new FormGroup({}); // Creates a new FormGroup instance.
}
```

I will learn about nested `FormGroups` later.

The key name doesn't matter much, just that the value should be of type `FormControl`.

`FormControl` constructor can be used without any arguments i.e. to setup a `FormControl` without any initial value. It can have initial value also.

```ts
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl(''), // initial value of this control is an empty string!
    password: new FormControl(''),
  });
}
```

Then, add an `onSubmit()` method and start using the `form`:

```ts
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit() {}
}
```

So the first step is to setup the form on my own. The second step is to let Angular know how this form is connected to my actual template.

## Syncing Reactive Form Definition & Template

Import this module for Reactive Forms (which is different from the template driven approach's `FormModule`):

```ts
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule], // addded!
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit() {}
}
```

After that, I can go to my template and add the `formControl` directive the email `input`.

Like this:

```html
<form>
  <h2>Login</h2>

  <div class="control-row">
    <div class="control no-margin">
      <label for="email">Email</label>
      <input id="email" type="email" [formControl]="form.controls.email" /> <--- here!
    </div>

    <div class="control no-margin">
      <label for="password">Password</label>
      <input id="password" type="password" [formControl]="form.controls.password" /> <--- here!
    </div>

    <button class="button" (click)="onSubmit()">Login</button>
  </div>
</form>
```

### What is `[formControl]`?

The square brackets `[ ]` are Angular property binding. They mean: "take this value from my TypeScript class and give it to this element." Without brackets, Angular would treat `form.controls.email` as a plain text string.

`formControl` is a directive. A directive is a small piece of Angular code that attaches to an HTML element and gives it extra behaviour. This one comes from `ReactiveFormsModule`. Its job is to link the `<input>` on the screen to the `FormControl` object in your class.

After it is linked, the sync works both ways:

You type in the input, so the `FormControl` value updates.
Your code calls `setValue('a@b.com')`, so the input shows the new text.

### Is `controls` a property of `FormGroup`?

When you write this:

```ts
new FormGroup({
  email: new FormControl(''),
  password: new FormControl(''),
});
```

the object you pass in is stored inside the FormGroup as its controls property. So form.controls is that same object:

```ts
form.controls          // { email: FormControl, password: FormControl }
form.controls.email    // the exact FormControl you created
```

Since Angular 14, forms are "typed". This means TypeScript remembers your key names. That is why `form.controls.email` gets autocomplete and `form.controls.emial` gives a compile error.

Back to the course content.

Angular also gives us a shorter way. Instead, I can use `formControlName` this directive like this:

```html
<form>
  <h2>Login</h2>

  <div class="control-row">
    <div class="control no-margin">
      <label for="email">Email</label>
      <input id="email" type="email" formControlName="email" /> <--- here!
    </div>

    <div class="control no-margin">
      <label for="password">Password</label>
      <input id="password" type="password" formControlName="password" /> <--- here!
    </div>

    <button class="button" (click)="onSubmit()">Login</button>
  </div>
</form>
```

Those names need to be the same key name as in the TypeScript class here:

```ts
form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
});
```


But now the browser will show this error:

```
ERROR RuntimeError: NG01050: formControlName must be used with a parent formGroup directive. You'll want to add a formGroup directive and pass it an existing FormGroup instance (you can create one in your class). 

Affected Form Control name: "email"

Example:

<div [formGroup]="myGroup">
    <input formControlName="firstName">
</div>

In your class:

this.myGroup = new FormGroup({
    firstName: new FormControl()
});
```

It's because the overall form is not connected to this form yet.

What I need to do is using property binding i.e. binding the `formGroup` directive to my `form` property at the `<form />` tag:

```html
<form [formGroup]="form"> <--- here!
  <h2>Login</h2>

  <div class="control-row">
    <div class="control no-margin">
      <label for="email">Email</label>
      <input id="email" type="email" formControlName="email" />
    </div>

    <div class="control no-margin">
      <label for="password">Password</label>
      <input id="password" type="password" formControlName="password" />
    </div>

    <button class="button" (click)="onSubmit()">Login</button>
  </div>
</form>
```

Now the browser's error is gone!

So now I've done the form setup work in the TypeScript class (i.e. the component) and have also linked the controls to the template's elements.

Next, I will work on form submissions, validations, and other things. 

## Handling Form Submisssion (Reactive Forms)

In the template it can be the same as the template driven approach which is to listen to the `ngSubmit` event and let it call whatever methods like `onSubmit()`.

The main difference is that I don't need to pass any arguments into `onSubmit()` as I already have access to the form in my class as it's setup in the TypeScript class after all.

So here in `onSubmit()`, I can just do `console.log(this.form);` to see what is inside the form there:

```ts
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit() {
    console.log(this.form);
  }
}
```

In the browser, the same kind of `FormGroup` object is logged in the dev tool > console tab as the previous template-driven approach (as Angular manages the forms the same way under the hood, just the setup work is different for us).

The form properties and each control has more of its details:

![Project13-screenshot23](/01-starting-project-section-13/section13-demo/Project-13-2026-10-03-1.png)

Since TypeScript understands the shape of my `form`, I can access the `email` control easily like this:

```ts
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit() {
    console.log(this.form);
    console.log('this.form.value.email: ', this.form.value.email);
  }
}
```

In the dev tool > console tab:

![Project13-screenshot24](/01-starting-project-section-13/section13-demo/Project-13-2026-10-03-2.png)

Then, I'm saving those form fields values into these variables, `enteredEmail` and `enteredPassword`:

```ts
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit() {
    console.log(this.form);
    const enteredEmail = this.form.value.email; // added!
    const enteredPassword = this.form.value.password; // added!
    console.log({                           // added!
      'enteredEmail': enteredEmail,
      'enteredPassword': enteredPassword
    });
  }
}
```

In the dev tool > console tab:

![Project13-screenshot25](/01-starting-project-section-13/section13-demo/Project-13-2026-10-03-3.png)

## Adding Validators to Reactive Forms

I set up everything in the TypeScript class when the form is created as a second argument.

It's a configuration object like this:

```ts
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [], // here!
    }), 
    password: new FormControl(''),
  });
}
```

Then I can pass a `Validator` like this so to add the built-in checks.

`Validator` class provides a set of built-in validators that can be used by form controls.

`Validators.email` means the value has to be in the email format.

```ts
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators, // imported!
} from '@angular/forms';

export class LoginComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email], // here!
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)], // here!
    }),
  });
}
```

And update the template to show the error messages:

```html
<form [formGroup]="form">
  <h2>Login</h2>

  <div class="control-row">
    <div class="control no-margin">
      <label for="email">Email</label>
      <input id="email" type="email" formControlName="email" />
    </div>

    <div class="control no-margin">
      <label for="password">Password</label>
      <input id="password" type="password" formControlName="password" />
    </div>

    <button class="button" (click)="onSubmit()">Login</button>
  </div>

  @if (form.controls.email.touched && form.controls.email.dirty && form.controls.email.invalid) {
    <p class="error-text">Please enter a valid email address.</p>
  }

  @if (form.controls.password.touched && form.controls.password.dirty && form.controls.password.invalid) {
    <p class="error-text">Password must be at least 6 characters long.</p>
  }
</form>
```

Since this is a lot of code, I can write a getter in the TypeScript class instead:

```ts
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  get emailIsInvalid() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }

  get passwordIsInvalid() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }

  onSubmit() {
    console.log(this.form);
    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;
    console.log({
      enteredEmail: enteredEmail,
      enteredPassword: enteredPassword,
    });
  }
}
```

And template can just use `emailIsInvalid` and `passwordIsInvalid` properties:

```html
<form [formGroup]="form">
  <h2>Login</h2>

  <div class="control-row">
    <div class="control no-margin">
      <label for="email">Email</label>
      <input id="email" type="email" formControlName="email" />
    </div>

    <div class="control no-margin">
      <label for="password">Password</label>
      <input id="password" type="password" formControlName="password" />
    </div>

    <button class="button" (click)="onSubmit()">Login</button>
  </div>

  @if (emailIsInvalid) {
    <p class="error-text">Please enter a valid email address.</p>
  }

  @if (passwordIsInvalid) {
    <p class="error-text">Password must be at least 6 characters long.</p>
  }
</form>
```

Then the UI looks like this when I tap a field (so it's `touched`), type one character into the field (so it's `dirty`), and then tap out of the field (so the field like `email` is `invalid`):

![Project13-screenshot26](/01-starting-project-section-13/section13-demo/Project-13-2026-10-05-1.png)

The ng class is added `class="ng-invalid ng-dirty ng-touched"` like before:

![Project13-screenshot27](/01-starting-project-section-13/section13-demo/Project-13-2026-10-05-2.png)

When I type in valid email and password e.g. `test@gmail.com` and `123456`, it's able to show the ng class becomes `class="ng-dirty ng-touched ng-valid ng-submitted"`:

![Project13-screenshot28](/01-starting-project-section-13/section13-demo/Project-13-2026-10-05-3.png)

## Building Custome Validators