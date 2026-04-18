import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthResponse {
  token: string;
  role: string;
  fullName: string;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = 'https://wade-nonauthentical-yawnfully.ngrok-free.dev';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/auth/login`, { username, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('fullName', res.fullName);
        localStorage.setItem('username', res.username);
      })
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getToken(): string | null { return localStorage.getItem('token'); }
  getRole(): string | null { return localStorage.getItem('role'); }
  getFullName(): string | null { return localStorage.getItem('fullName'); }
  getUsername(): string | null { return localStorage.getItem('username'); }

  isLoggedIn(): boolean { return !!this.getToken(); }
  isAgent(): boolean { return this.getRole() === 'AGENT'; }
  isAdmin(): boolean { return this.getRole() === 'ADMIN'; }
  isSuperAdmin(): boolean { return this.getRole() === 'SUPER_ADMIN'; }
  isAdminOrAbove(): boolean { return this.isAdmin() || this.isSuperAdmin(); }
}
