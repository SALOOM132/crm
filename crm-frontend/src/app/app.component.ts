import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, NgIf],
  template: `
    <div class="app-shell" *ngIf="auth.isLoggedIn(); else loginView">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <span class="brand-name">NexCRM</span>
        </div>

        <nav class="nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>Dashboard</span>
          </a>
          <a routerLink="/tickets" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>Conversations</span>
          </a>
          <a routerLink="/analytics" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            <span>Analytics</span>
          </a>
          <!-- Admin only -->
          <a *ngIf="auth.isAdmin()" routerLink="/admin" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>Users</span>
          </a>
          <a routerLink="/settings" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 19.07l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M22 12h-2M2 12h2M12 22v-2M12 2v2"/></svg>
            <span>Settings</span>
          </a>
        </nav>

        <!-- User info + logout -->
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">{{ getInitial() }}</div>
            <div class="user-details">
              <div class="user-name">{{ auth.getFullName() }}</div>
              <div class="user-role">{{ auth.getRole() }}</div>
            </div>
          </div>
          <button class="btn-logout" (click)="auth.logout()" title="Logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </aside>

      <!-- Main content -->
      <main class="main-content">
        <router-outlet/>
      </main>
    </div>

    <!-- Login view (no sidebar) -->
    <ng-template #loginView>
      <router-outlet/>
    </ng-template>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700;800&display=swap');

    :host { display: block; height: 100vh; font-family: 'DM Sans', sans-serif; }


    .app-shell { display: flex; height: 100vh; background: #0a0a0f; color: #e8e8f0; }

    .sidebar {
      width: 220px; min-width: 220px;
      background: #0f0f1a;
      border-right: 1px solid rgba(255,255,255,0.06);
      display: flex; flex-direction: column;
      padding: 24px 0;
    }

    .brand {
      display: flex; align-items: center; gap: 10px;
      padding: 0 20px 28px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }

    .brand-icon {
      width: 36px; height: 36px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      color: white;
    }

    .brand-name {
      font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700;
      background: linear-gradient(135deg, #a5b4fc, #c084fc);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }

    .nav {
      display: flex; flex-direction: column; gap: 2px;
      padding: 20px 12px; flex: 1;
    }

    .nav-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; border-radius: 8px;
      color: #6b6b8a; text-decoration: none;
      font-size: 14px; font-weight: 500;
      transition: all 0.2s;
    }

    .nav-item:hover { color: #e8e8f0; background: rgba(255,255,255,0.05); }
    .nav-item.active { color: #a5b4fc; background: rgba(99,102,241,0.12); }
    .nav-item.active svg { stroke: #a5b4fc; }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid rgba(255,255,255,0.06);
      display: flex; align-items: center; gap: 10px;
    }

    .user-info { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }

    .user-avatar {
      width: 32px; height: 32px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 600; color: white;
      flex-shrink: 0;
    }

    .user-details { min-width: 0; }

    .user-name {
      font-size: 13px; font-weight: 500; color: #e8e8f0;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }

    .user-role {
      font-size: 10px; color: #6b6b8a;
      text-transform: uppercase; letter-spacing: 0.05em;
    }

    .btn-logout {
      background: none; border: none;
      color: #6b6b8a; cursor: pointer;
      padding: 6px; border-radius: 6px;
      display: flex; align-items: center;
      transition: all 0.2s; flex-shrink: 0;
    }

    .btn-logout:hover { color: #f87171; background: rgba(239,68,68,0.1); }

    .main-content { flex: 1; overflow-y: auto; background: #0a0a0f; }
  `]
})
export class AppComponent {
  constructor(public auth: AuthService) {}

  getInitial(): string {
    const name = this.auth.getFullName();
    return name ? name.charAt(0).toUpperCase() : '?';
  }
}
