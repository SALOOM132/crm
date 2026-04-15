import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
let AppComponent = class AppComponent {
};
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        standalone: true,
        imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
        template: `
    <div class="app-shell">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <span class="brand-name">CRM</span>
        </div>

        <nav class="nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>Dashboard</span>
          </a>
          <a routerLink="/tickets" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
            <span>Tickets</span>
          </a>
          <a routerLink="/analytics" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            <span>Analytics</span>
          </a>
          <a routerLink="/settings" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 19.07l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M22 12h-2M2 12h2M12 22v-2M12 2v2"/></svg>
            <span>Settings</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="source-badges">
            <span class="badge instagram">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path fill="white" d="M12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm5.4-9.87a1.2 1.2 0 1 0 1.2 1.2 1.2 1.2 0 0 0-1.2-1.2z"/></svg>
              Instagram
            </span>
            <span class="badge messenger">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.45 3.14 7.17.16.13.25.31.26.51l.06 1.59a.75.75 0 0 0 1.05.66l1.77-.78a.73.73 0 0 1 .49-.05c.91.25 1.87.38 2.87.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2z"/></svg>
              Messenger
            </span>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <main class="main-content">
        <router-outlet/>
      </main>
    </div>
  `,
        styles: [`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700;800&display=swap');

    :host {
      display: block;
      height: 100vh;
      font-family: 'DM Sans', sans-serif;
    }

    .app-shell {
      display: flex;
      height: 100vh;
      background: #0a0a0f;
      color: #e8e8f0;
    }

    .sidebar {
      width: 220px;
      min-width: 220px;
      background: #0f0f1a;
      border-right: 1px solid rgba(255,255,255,0.06);
      display: flex;
      flex-direction: column;
      padding: 24px 0;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 20px 28px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }

    .brand-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .brand-name {
      font-family: 'Syne', sans-serif;
      font-size: 18px;
      font-weight: 700;
      background: linear-gradient(135deg, #a5b4fc, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .nav {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 20px 12px;
      flex: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      color: #6b6b8a;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
      letter-spacing: 0.01em;
    }

    .nav-item:hover {
      color: #e8e8f0;
      background: rgba(255,255,255,0.05);
    }

    .nav-item.active {
      color: #a5b4fc;
      background: rgba(99, 102, 241, 0.12);
    }

    .nav-item.active svg {
      stroke: #a5b4fc;
    }

    .sidebar-footer {
      padding: 16px 16px 0;
      border-top: 1px solid rgba(255,255,255,0.06);
    }

    .source-badges {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .badge {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 500;
      padding: 5px 8px;
      border-radius: 6px;
      letter-spacing: 0.02em;
    }

    .badge.instagram {
      background: rgba(225, 48, 108, 0.12);
      color: #f06292;
    }

    .badge.messenger {
      background: rgba(0, 120, 255, 0.12);
      color: #64b5f6;
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      background: #0a0a0f;
    }
  `]
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map