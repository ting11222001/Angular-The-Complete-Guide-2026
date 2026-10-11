import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';

function equalValues(controlName1: string, controlName2: string): ValidatorFn {
 return (control: AbstractControl) => {   // control will be the passwords FormGroup.

    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;

    if (val1 === val2) {
      return null;
    }

    return { valuesNotEqual: true };
 }
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    passwords: new FormGroup({
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)]
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)] // will build a custom validator to make sure both pwd are equal
      }),
    }, {
      validators:[equalValues('password', 'confirmPassword')]
    }),
    firstName: new FormControl('', {
      validators: [Validators.required]
    }),
    lastName: new FormControl('', {
      validators: [Validators.required]
    }),
    address: new FormGroup({
      street: new FormControl('', {
        validators: [Validators.required]
      }),
      number: new FormControl('', {
        validators: [Validators.required]
      }),
      postalCode: new FormControl('', {
        validators: [Validators.required]
      }),
      city: new FormControl('', {
        validators: [Validators.required]
      }),
    }),
    role: new FormControl<'student' | 'teacher' | 'employee' | 'founder' | 'other'>('student', {
      validators: [Validators.required]
    }),
    source: new FormArray([
      new FormControl(false), // Google
      new FormControl(false), // Referred by Friend
      new FormControl(false), // Other
    ]),
    agree: new FormControl(false, {
      validators: [Validators.required]
    })
  });

  onSubmit() {
    if (this.form.invalid) {
      console.log('INVALID FORM!');
      return;
    }
    console.log(this.form.value);
    console.log(this.form);
  }

  onReset() {
    this.form.reset();
  }
}
