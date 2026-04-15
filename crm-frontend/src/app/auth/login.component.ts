import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule],
  template: `
    <div class="login-shell">
      <div class="login-card">
        <div class="brand">
          <div class="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <span class="brand-name">NexCRM</span>
        </div>

        <h1 class="login-title">Welcome back</h1>
        <p class="login-sub">Sign in to your account</p>

        <div *ngIf="error" class="error-box">{{ error }}</div>

        <div class="form-group">
          <label>Username</label>
          <input
            type="text"
            [(ngModel)]="username"
            placeholder="Enter username"
            (keydown.enter)="login()"
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            type="password"
            [(ngModel)]="password"
            placeholder="Enter password"
            (keydown.enter)="login()"
          />
        </div>

        <button class="btn-login" (click)="login()" [disabled]="loading">
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700;800&display=swap');

    .login-shell {
      min-height: 100vh;
      background: #0a0a0f;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'DM Sans', sans-serif;
    }

    .login-card {
      background: #0f0f1a;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 40px;
      width: 380px;
      max-width: 90vw;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 32px;
    }

    .brand-icon {
      width: 40px; height: 40px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .brand-name {
      font-family: 'Syne', sans-serif;
      font-size: 20px;
      font-weight: 700;
      background: linear-gradient(135deg, #a5b4fc, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .login-title {
      font-family: 'Syne', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: #e8e8f0;
      margin: 0 0 6px;
    }

    .login-sub {
      color: #6b6b8a;
      font-size: 14px;
      margin: 0 0 28px;
    }

    .error-box {
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.2);
      color: #f87171;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 13px;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 18px;
    }

    .form-group label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: #6b6b8a;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 7px;
    }

    .form-group input {
      width: 100%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      color: #e8e8f0;
      padding: 11px 14px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }

    .form-group input:focus { border-color: #6366f1; }
    .form-group input::placeholder { color: #4a4a6a; }


    .btn-login {
      width: 100%;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      border: none;
      padding: 12px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      margin-top: 8px;
      transition: opacity 0.2s;
    }

    .btn-login:hover { opacity: 0.85; }
    .btn-login:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    if (!this.username || !this.password) {
      this.error = 'Please enter username and password';
      return;
    }
    this.loading = true;
    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.error = 'Invalid username or password';
      }
    });
  }
}
