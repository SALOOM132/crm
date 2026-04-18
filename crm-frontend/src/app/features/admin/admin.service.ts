import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AppUser {
  id: number;
  username: string;
  fullName: string;
  role: 'ADMIN' | 'AGENT' |'SUPER_ADMIN';
  enabled: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = 'https://wade-nonauthentical-yawnfully.ngrok-free.dev';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.base}/admin/users`);
  }

  createUser(data: { username: string; password: string; fullName: string; role: string }): Observable<AppUser> {
    return this.http.post<AppUser>(`${this.base}/admin/users`, data);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.base}/admin/users/${id}`);
  }

  toggleUser(id: number): Observable<AppUser> {
    return this.http.patch<AppUser>(`${this.base}/admin/users/${id}/toggle`, {});
  }

  updateUser(id: number, data: { fullName?: string; password?: string }): Observable<AppUser> {
    return this.http.put<AppUser>(`${this.base}/admin/users/${id}`, data);
  }
}
