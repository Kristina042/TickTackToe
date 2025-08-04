import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  router = inject(Router);
  authService = inject(AuthService)

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  get email() {
    return this.loginForm.get('email')
  }

  get password() {
    return this.loginForm.get('password')
  }

  submitForm() {
    if (this.loginForm.invalid) return

    const rawForm = this.loginForm.getRawValue()

    if (!rawForm.email || !rawForm.password)  return

    const formData = {
      email: rawForm.email!,
      password: rawForm.password!,
    }

    this.authService.login(formData).subscribe(result => {
      if (!result.error)
        this.router.navigate(['/'])
    })
  }


}
