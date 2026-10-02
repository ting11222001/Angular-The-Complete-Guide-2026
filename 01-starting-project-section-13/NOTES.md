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