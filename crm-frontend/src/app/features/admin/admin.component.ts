import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, AppUser } from './admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">User Management</h1>
          <p class="page-sub">{{ users.length }} users registered</p>
        </div>
        <button class="btn-primary" (click)="showCreate = true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Agent
        </button>
      </div>

      <div *ngIf="loading" class="loading-state"><div class="spinner"></div></div>

      <div *ngIf="!loading" class="users-table">
        <div class="table-row header-row">
          <span>Full Name</span>
          <span>Username</span>
          <span>Role</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        <div *ngFor="let user of users" class="table-row">
          <span class="user-name">{{ user.fullName }}</span>
          <span class="user-username">{{ user.username }}</span>
          <span>
            <span class="role-badge" [class.admin]="user.role === 'ADMIN'" [class.agent]="user.role === 'AGENT'">
              {{ user.role }}
            </span>
          </span>
          <span>
            <span class="status-badge" [class.active]="user.enabled" [class.inactive]="!user.enabled">
              {{ user.enabled ? 'Active' : 'Disabled' }}
            </span>
          </span>
          <span class="actions">
            <button class="btn-action" (click)="toggleUser(user)" [title]="user.enabled ? 'Disable' : 'Enable'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path *ngIf="user.enabled" d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
                <path *ngIf="!user.enabled" d="M12 2v10M4.93 4.93l1.41 1.41M2 12h2M4.93 19.07l1.41-1.41M12 22v-2M19.07 19.07l-1.41-1.41M22 12h-2M19.07 4.93l-1.41 1.41"/>
                <line *ngIf="user.enabled" x1="12" y1="2" x2="12" y2="12"/>
              </svg>
            </button>
            <button class="btn-action edit" (click)="openEdit(user)" title="Edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn-action delete" (click)="deleteUser(user)" title="Delete">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </span>
        </div>
      </div>
    </div>


    <!-- Create User Modal -->
    <div *ngIf="showCreate" class="modal-overlay" (click)="showCreate = false">
      <div class="modal" (click)="stopProp($event)">
        <div class="modal-header">
          <h3>Add New Agent</h3>
          <button (click)="showCreate = false" class="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <div *ngIf="createError" class="error-box">{{ createError }}</div>
          <div class="field">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="newUser.fullName" placeholder="e.g. John Doe"/>
          </div>
          <div class="field">
            <label>Username</label>
            <input type="text" [(ngModel)]="newUser.username" placeholder="e.g. johndoe"/>
          </div>
          <div class="field">
            <label>Password</label>
            <input type="password" [(ngModel)]="newUser.password" placeholder="Min 6 characters"/>
          </div>
          <div class="field">
            <label>Role</label>
            <select [(ngModel)]="newUser.role">
              <option value="AGENT">Agent</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-ghost" (click)="showCreate = false">Cancel</button>
          <button class="btn-primary" (click)="createUser()" [disabled]="creating">
            {{ creating ? 'Creating...' : 'Create' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div *ngIf="editUser" class="modal-overlay" (click)="editUser = null">
      <div class="modal" (click)="stopProp($event)">
        <div class="modal-header">
          <h3>Edit {{ editUser.fullName }}</h3>
          <button (click)="editUser = null" class="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="field">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="editForm.fullName"/>
          </div>
          <div class="field">
            <label>New Password (leave blank to keep)</label>
            <input type="password" [(ngModel)]="editForm.password" placeholder="Leave blank to keep current"/>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-ghost" (click)="editUser = null">Cancel</button>
          <button class="btn-primary" (click)="saveEdit()" [disabled]="saving">
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700;800&display=swap');

    .page { padding: 36px 40px; font-family: 'DM Sans', sans-serif; max-width: 100%; }

    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }

    .page-title { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; color: #e8e8f0; margin: 0 0 4px; }
    .page-sub { color: #6b6b8a; font-size: 13px; margin: 0; }

    .btn-primary { display: flex; align-items: center; gap: 7px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    .users-table { background: #0f0f1a; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; overflow: hidden; }

    .table-row { display: grid; grid-template-columns: 1.5fr 1fr 0.8fr 0.8fr 120px; align-items: center; padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 13px; gap: 12px; }
    .table-row:last-child { border-bottom: none; }

    .header-row { background: rgba(255,255,255,0.02); color: #6b6b8a; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }


    .user-name { color: #e8e8f0; font-weight: 500; }
    .user-username { font-family: monospace; color: #6b6b8a; font-size: 12px; }

    .role-badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; letter-spacing: 0.04em; }
    .role-badge.admin { background: rgba(99,102,241,0.15); color: #a5b4fc; }
    .role-badge.agent { background: rgba(29,158,117,0.15); color: #34d399; }

    .status-badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 500; }
    .status-badge.active { background: rgba(52,211,153,0.12); color: #34d399; }
    .status-badge.inactive { background: rgba(107,107,138,0.12); color: #9090b0; }

    .actions { display: flex; gap: 6px; }

    .btn-action { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: #9090b0; width: 30px; height: 30px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
    .btn-action:hover { color: #e8e8f0; background: rgba(255,255,255,0.1); }
    .btn-action.edit:hover { color: #a5b4fc; }
    .btn-action.delete:hover { color: #f87171; background: rgba(239,68,68,0.1); }

    .loading-state { display: flex; justify-content: center; padding: 60px; }
    .spinner { width: 28px; height: 28px; border: 2px solid rgba(255,255,255,0.1); border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 200; }
    .modal { background: #13131f; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; width: 440px; max-width: 90vw; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 22px; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .modal-header h3 { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 600; color: #e8e8f0; margin: 0; }
    .modal-close { background: none; border: none; color: #6b6b8a; cursor: pointer; font-size: 16px; }
    .modal-body { padding: 20px 22px; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 8px; padding: 14px 22px; border-top: 1px solid rgba(255,255,255,0.06); }

    .field { margin-bottom: 14px; }
    .field label { display: block; font-size: 11px; color: #6b6b8a; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 7px; }
    .field input, .field select { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: #e8e8f0; padding: 9px 12px; font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
    .field input:focus, .field select:focus { border-color: #6366f1; }
    .field select option { background: #13131f; }

    .error-box { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #f87171; border-radius: 8px; padding: 10px 14px; font-size: 13px; margin-bottom: 14px; }

    .btn-ghost { background: none; border: 1px solid rgba(255,255,255,0.08); color: #9090b0; padding: 8px 14px; border-radius: 7px; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  `]
})
export class AdminComponent implements OnInit {
  users: AppUser[] = [];
  loading = true;
  showCreate = false;
  creating = false;
  createError = '';
  editUser: AppUser | null = null;
  editForm = { fullName: '', password: '' };
  saving = false;

  newUser = { fullName: '', username: '', password: '', role: 'AGENT' };

  constructor(private adminSvc: AdminService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.adminSvc.getUsers().subscribe({
      next: (data) => { this.users = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }


  createUser() {
    this.createError = '';
    if (!this.newUser.fullName || !this.newUser.username || !this.newUser.password) {
      this.createError = 'All fields are required';
      return;
    }
    this.creating = true;
    this.adminSvc.createUser(this.newUser).subscribe({
      next: () => {
        this.creating = false;
        this.showCreate = false;
        this.newUser = { fullName: '', username: '', password: '', role: 'AGENT' };
        this.load();
      },
      error: (err) => {
        this.creating = false;
        this.createError = err.error?.error || 'Failed to create user';
      }
    });
  }

  toggleUser(user: AppUser) {
    this.adminSvc.toggleUser(user.id).subscribe({
      next: (updated) => {
        const idx = this.users.findIndex(u => u.id === updated.id);
        if (idx !== -1) this.users[idx] = updated;
      }
    });
  }

  deleteUser(user: AppUser) {
    if (!confirm(`Delete ${user.fullName}?`)) return;
    this.adminSvc.deleteUser(user.id).subscribe({
      next: () => { this.users = this.users.filter(u => u.id !== user.id); }
    });
  }

  openEdit(user: AppUser) {
    this.editUser = user;
    this.editForm = { fullName: user.fullName, password: '' };
  }

  saveEdit() {
    if (!this.editUser) return;
    this.saving = true;
    this.adminSvc.updateUser(this.editUser.id, this.editForm).subscribe({
      next: (updated) => {
        const idx = this.users.findIndex(u => u.id === updated.id);
        if (idx !== -1) this.users[idx] = updated;
        this.saving = false;
        this.editUser = null;
      },
      error: () => { this.saving = false; }
    });
  }

  stopProp(e: MouseEvent) { e.stopPropagation(); }
}
