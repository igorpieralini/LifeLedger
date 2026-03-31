import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'll-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule,
            MatFormFieldModule, MatInputModule, MatButtonModule,
            MatIconModule, MatProgressSpinnerModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  loading  = signal(false);
  error    = signal('');
  showPass = signal(false);

  form = this.fb.group({
    name:     ['', [Validators.required, Validators.minLength(2)]],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  togglePass() { this.showPass.update(v => !v); }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');

    this.authService.register(this.form.value as any).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error.set(err.error?.message ?? 'Erro ao criar conta');
        this.loading.set(false);
      }
    });
  }
}
