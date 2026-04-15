import { Component } from '@angular/core';
import { CommonModule,NgIf } from '@angular/common';import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
imports: [CommonModule, NgIf, FormsModule],  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Settings</h1>
        <p class="page-sub">API configuration & integrations</p>
      </div>

      <div class="settings-grid">
        <!-- Backend Config -->
        <div class="settings-card">
          <div class="card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            Backend
          </div>

          <div class="field">
            <label>Base URL (ngrok)</label>
            <div class="input-with-status">
              <input type="text" [(ngModel)]="apiUrl" [readonly]="!editingUrl" [class.editing]="editingUrl" />
              <button *ngIf="!editingUrl" (click)="editingUrl = true" class="btn-edit">Edit</button>
              <button *ngIf="editingUrl" (click)="saveUrl()" class="btn-save">Save</button>
            </div>
          </div>

          <div class="field">
            <label>AI Service URL</label>
            <input type="text" value="http://localhost:8000/predict" readonly />
          </div>

          <div class="connection-status">
            <span class="status-dot" [class.connected]="connected" [class.unknown]="!checked"></span>
            <span>{{ checked ? (connected ? 'Connected' : 'Unreachable') : 'Not tested' }}</span>
            <button (click)="testConnection()" class="btn-test" [disabled]="testing">
              {{ testing ? 'Testing...' : 'Test connection' }}
            </button>
          </div>
        </div>

        <!-- Webhook Info -->
        <div class="settings-card">
          <div class="card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            Webhook (Meta)
          </div>

          <div class="info-row">
            <span class="info-label">Verification endpoint</span>
            <code class="code-val">GET /webhook</code>
          </div>
          <div class="info-row">
            <span class="info-label">Message endpoint</span>
            <code class="code-val">POST /webhook</code>
          </div>
          <div class="info-row">
            <span class="info-label">Full webhook URL</span>
            <code class="code-val small">{{ apiUrl }}/webhook</code>
          </div>

          <div class="info-box">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Set this URL as your Meta App webhook callback in the Developer Portal.
          </div>
        </div>

        <!-- Sources -->
        <div class="settings-card">
          <div class="card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/></svg>
            Connected Sources
          </div>

          <div class="source-row">
            <div class="source-info">
              <div class="source-name instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5"/><path fill="white" d="M12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm5.4-9.87a1.2 1.2 0 1 0 1.2 1.2 1.2 1.2 0 0 0-1.2-1.2z"/></svg>
                Instagram
              </div>
              <span class="source-sub">Connected via Meta webhook</span>
            </div>
            <span class="src-status active">Active</span>
          </div>

          <div class="source-row">
            <div class="source-info">
              <div class="source-name messenger">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.45 3.14 7.17.16.13.25.31.26.51l.06 1.59a.75.75 0 0 0 1.05.66l1.77-.78a.73.73 0 0 1 .49-.05c.91.25 1.87.38 2.87.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2z"/></svg>
                Messenger
              </div>
              <span class="source-sub">Connected via Meta webhook</span>
            </div>
            <span class="src-status active">Active</span>
          </div>

          <div class="source-row">
            <div class="source-info">
              <div class="source-name test">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                Test API
              </div>
              <span class="source-sub">POST /test</span>
            </div>
            <span class="src-status active">Active</span>
          </div>
        </div>

        <!-- ML Config -->
        <div class="settings-card">
          <div class="card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            ML Intent Detection
          </div>

          <div class="info-row">
            <span class="info-label">Min confidence threshold</span>
            <code class="code-val">0.70 (70%)</code>
          </div>
          <div class="info-row">
            <span class="info-label">Below threshold label</span>
            <code class="code-val">unknown</code>
          </div>
          <div class="info-row">
            <span class="info-label">Failure fallback</span>
            <code class="code-val">unknown (0.0)</code>
          </div>

          <div class="info-box">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            These settings are configured in your Spring Boot application.properties.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700;800&display=swap');

    .page {
      padding: 36px 40px;
      font-family: 'DM Sans', sans-serif;
      max-width: 2100px;
    }

    .page-title {
      font-family: 'Syne', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #e8e8f0;
      margin: 0 0 4px;
    }
    .page-sub { color: #6b6b8a; font-size: 13px; margin: 0 0 28px; }

    .settings-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .settings-card {
      background: #0f0f1a;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      padding: 22px;
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Syne', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: #9090b0;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 20px;
    }

    .field { margin-bottom: 14px; }

    .field label {
      display: block;
      font-size: 11px;
      color: #6b6b8a;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }

    .field input, .input-with-status input {
      width: 100%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 7px;
      color: #9090b0;
      padding: 8px 12px;
      font-family: monospace;
      font-size: 12px;
      outline: none;
      box-sizing: border-box;
    }

    .field input.editing {
      border-color: #6366f1;
      color: #e8e8f0;
    }

    .input-with-status {
      display: flex;
      gap: 8px;
    }

    .btn-edit, .btn-save {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      color: #9090b0;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
      font-family: 'DM Sans', sans-serif;
    }
    .btn-save { background: rgba(99,102,241,0.15); color: #a5b4fc; border-color: rgba(99,102,241,0.3); }

    .connection-status {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      font-size: 12px;
      color: #6b6b8a;
    }

    .status-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #3a3a5c;
    }
    .status-dot.connected { background: #34d399; box-shadow: 0 0 8px rgba(52,211,153,0.5); }
    .status-dot.unknown { background: #fbbf24; }

    .btn-test {
      margin-left: auto;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      color: #9090b0;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 11px;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
    }
    .btn-test:hover { color: #e8e8f0; }
    .btn-test:disabled { opacity: 0.4; }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .info-row:last-of-type { border-bottom: none; }

    .info-label { font-size: 12px; color: #6b6b8a; }

    code.code-val {
      font-family: monospace;
      font-size: 11px;
      color: #a5b4fc;
      background: rgba(99,102,241,0.1);
      padding: 2px 7px;
      border-radius: 4px;
    }

    code.code-val.small { font-size: 10px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; }

    .info-box {
      display: flex;
      align-items: flex-start;
      gap: 7px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 7px;
      padding: 10px 12px;
      font-size: 12px;
      color: #6b6b8a;
      line-height: 1.5;
      margin-top: 14px;
    }

    /* Sources */
    .source-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .source-row:last-child { border-bottom: none; }

    .source-info { display: flex; flex-direction: column; gap: 3px; }

    .source-name {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 13px;
      color: #c8c8d8;
      font-weight: 500;
    }

    .source-name.instagram svg { color: #f06292; }
    .source-name.messenger svg { color: #64b5f6; }
    .source-name.test svg { stroke: #a5b4fc; }

    .source-sub { font-size: 11px; color: #4a4a6a; margin-left: 23px; }

    .src-status {
      font-size: 10px;
      font-weight: 500;
      padding: 3px 8px;
      border-radius: 4px;
      letter-spacing: 0.04em;
    }
    .src-status.active { background: rgba(52,211,153,0.12); color: #34d399; }
  `]
})
export class SettingsComponent {
  apiUrl = 'https://wade-nonauthentical-yawnfully.ngrok-free.dev';
  editingUrl = false;
  connected = false;
  checked = false;
  testing = false;

  saveUrl() {
    this.editingUrl = false;
  }

  testConnection() {
    this.testing = true;
    fetch(`${this.apiUrl}/conversations`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(r => {
        this.connected = r.ok;
        this.checked = true;
        this.testing = false;
      })
      .catch(() => {
        this.connected = false;
        this.checked = true;
        this.testing = false;
      });
  }
}
