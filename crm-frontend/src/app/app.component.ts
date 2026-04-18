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
          <!-- All roles -->
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

          <!-- Divider for admin sections -->
          <div *ngIf="auth.isAdminOrAbove()" class="nav-divider"></div>

          <!-- Admin + Super Admin -->
          <a *ngIf="auth.isAdminOrAbove()" routerLink="/admin" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>Agents</span>
          </a>

          <!-- Super Admin only -->
          <a *ngIf="auth.isSuperAdmin()" routerLink="/superadmin" routerLinkActive="active" class="nav-item super">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>System</span>
          </a>

          <!-- Settings: Admin + Super Admin only -->
          <a *ngIf="auth.isAdminOrAbove()" routerLink="/settings" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 19.07l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M22 12h-2M2 12h2M12 22v-2M12 2v2"/></svg>
            <span>Settings</span>
          </a>
        </nav>


        <!-- Role badge + user info + logout -->
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar" [class.super-avatar]="auth.isSuperAdmin()" [class.admin-avatar]="auth.isAdmin()">
              {{ getInitial() }}
            </div>
            <div class="user-details">
              <div class="user-name">{{ auth.getFullName() }}</div>
              <div class="user-role-badge" [class.super]="auth.isSuperAdmin()" [class.admin]="auth.isAdmin()" [class.agent]="auth.isAgent()">
                {{ getRoleLabel() }}
              </div>
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

      <!-- ASM Corner Widget -->
      <div class="asm-widget">
        <a href="https://asm-tunisie.com/contacts/" target="_blank" class="asm-link">
          <div class="asm-dot"></div>
          <div class="asm-text">
            <span class="asm-name">ASM Tunisie</span>
            <span class="asm-contact">Contact us</span>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </div>
    </div>

    <!-- Login view -->
    <ng-template #loginView>
      <router-outlet/>
    </ng-template>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700;800&display=swap');

    :host { display: block; height: 100vh; font-family: 'DM Sans', sans-serif; }

    .app-shell { display: flex; height: 100vh; background: #0a0a0f; color: #e8e8f0; position: relative; }

    .sidebar { width: 220px; min-width: 220px; background: #0f0f1a; border-right: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; padding: 24px 0; }

    .brand { display: flex; align-items: center; gap: 10px; padding: 0 20px 28px; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .brand-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; }
    .brand-name { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; background: linear-gradient(135deg, #a5b4fc, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

    .nav { display: flex; flex-direction: column; gap: 2px; padding: 20px 12px; flex: 1; }

    .nav-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 8px 4px; }

    .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; color: #6b6b8a; text-decoration: none; font-size: 14px; font-weight: 500; transition: all 0.2s; }
    .nav-item:hover { color: #e8e8f0; background: rgba(255,255,255,0.05); }
    .nav-item.active { color: #a5b4fc; background: rgba(99,102,241,0.12); }
    .nav-item.active svg { stroke: #a5b4fc; }
    .nav-item.super.active { color: #f0997b; background: rgba(216,90,48,0.12); }
    .nav-item.super.active svg { stroke: #f0997b; }

    .sidebar-footer { padding: 16px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 10px; }

    .user-info { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }


    .user-avatar { width: 32px; height: 32px; background: linear-gradient(135deg, #1d9e75, #5dcaa5); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: white; flex-shrink: 0; }
    .user-avatar.admin-avatar { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
    .user-avatar.super-avatar { background: linear-gradient(135deg, #d85a30, #f0997b); }

    .user-details { min-width: 0; }
    .user-name { font-size: 13px; font-weight: 500; color: #e8e8f0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    .user-role-badge { font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; padding: 1px 5px; border-radius: 3px; display: inline-block; margin-top: 2px; }
    .user-role-badge.agent { background: rgba(29,158,117,0.15); color: #34d399; }
    .user-role-badge.admin { background: rgba(99,102,241,0.15); color: #a5b4fc; }
    .user-role-badge.super { background: rgba(216,90,48,0.15); color: #f0997b; }

    .btn-logout { background: none; border: none; color: #6b6b8a; cursor: pointer; padding: 6px; border-radius: 6px; display: flex; align-items: center; transition: all 0.2s; flex-shrink: 0; }
    .btn-logout:hover { color: #f87171; background: rgba(239,68,68,0.1); }

    .main-content { flex: 1; overflow-y: auto; background: #0a0a0f; }

    /* ── ASM Corner Widget ── */
    .asm-widget {
      position: fixed;
      bottom: 20px;
      right: 24px;
      z-index: 50;
    }

    .asm-link {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #0f0f1a;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      padding: 8px 14px;
      text-decoration: none;
      color: #9090b0;
      font-size: 12px;
      font-family: 'DM Sans', sans-serif;
      transition: all 0.2s;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    }

    .asm-link:hover {
      border-color: rgba(99,102,241,0.4);
      color: #e8e8f0;
      background: #13131f;
    }

    .asm-dot {
      width: 7px; height: 7px;
      background: #34d399;
      border-radius: 50%;
      box-shadow: 0 0 6px rgba(52,211,153,0.6);
      animation: pulse 2s ease-in-out infinite;
      flex-shrink: 0;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .asm-text { display: flex; flex-direction: column; }
    .asm-name { font-weight: 600; color: #c8c8d8; font-size: 12px; line-height: 1.3; }
    .asm-contact { font-size: 10px; color: #6b6b8a; line-height: 1.3; }
  `]
})
export class AppComponent {
  constructor(public auth: AuthService) {}

  getInitial(): string {
    const name = this.auth.getFullName();
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  getRoleLabel(): string {
    const role = this.auth.getRole();
    if (role === 'SUPER_ADMIN') return 'Super Admin';
    if (role === 'ADMIN') return 'Admin';
    return 'Agent';
  }
}
