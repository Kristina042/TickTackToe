import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RegisterRequest } from '../types';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  router = inject(Router)
  authService = inject(AuthService)

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })



  get name() {
    return this.registrationForm.get('name')
  }

  get email() {
    return this.registrationForm.get('email')
  }

  get password() {
    return this.registrationForm.get('password')
  }

  submitForm() {
    if (this.registrationForm.invalid) return

    const rawForm = this.registrationForm.getRawValue()

    if (!rawForm.name || !rawForm.email || !rawForm.password)  return

    const formData: RegisterRequest = {
      name: rawForm.name!,
      email: rawForm.email!,
      password: rawForm.password!,
    }

    this.authService.register(formData).subscribe(result => {
      if (!result.error) {
        this.router.navigate(['/'])
      }
    })
  }
}
