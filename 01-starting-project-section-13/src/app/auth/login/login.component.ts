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
  onSubmit(formData: NgForm) {
    const entertedEmail = formData.form.value.email;
    const entertedPassword = formData.form.value.password;
    console.log('entertedEmail: ', entertedEmail);
    console.log('entertedPassword: ', entertedPassword);
  }
}
