import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppUser } from '../admin/admin.service';

@Injectable({ providedIn: 'root' })
export class SuperAdminService {
  private base = 'https://wade-nonauthentical-yawnfully.ngrok-free.dev';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.base}/superadmin/users`);
  }

  getAdmins(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.base}/superadmin/admins`);
  }

  createAdmin(data: { username: string; password: string; fullName: string }): Observable<AppUser> {
    return this.http.post<AppUser>(`${this.base}/superadmin/admins`, data);
  }

  deleteAdmin(id: number): Observable<any> {
    return this.http.delete(`${this.base}/superadmin/admins/${id}`);
  }

  toggleUser(id: number): Observable<AppUser> {
    return this.http.patch<AppUser>(`${this.base}/superadmin/users/${id}/toggle`, {});
  }
}
