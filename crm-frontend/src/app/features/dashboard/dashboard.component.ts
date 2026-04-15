import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor, SlicePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConversationService } from '../../core/services/conversation.service';
import { Conversation } from '../../core/models/conversation.model';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, RouterLink, FormsModule, SlicePipe],
  template: `
    <div class="page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-sub">Overview of all incoming social messages</p>
        </div>
        <button class="btn-primary" (click)="showTestModal = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Test Conversation
        </button>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Conversations</div>
          <div class="stat-value">{{ tickets.length }}</div>
          <div class="stat-icon total">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Open</div>
          <div class="stat-value open">{{ openCount }}</div>
          <div class="stat-icon open-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Closed</div>
          <div class="stat-value closed">{{ closedCount }}</div>
          <div class="stat-icon closed-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Unique Intents</div>
          <div class="stat-value accent">{{ uniqueIntents }}</div>
          <div class="stat-icon intent-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
        </div>
      </div>

      <!-- Recent Conversations -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Recent Conversations</h2>
          <a routerLink="/tickets" class="view-all">View all →</a>
        </div>

        <div *ngIf="loading" class="loading-state">
          <div class="spinner"></div>
          <span>Loading Conversations...</span>
        </div>

        <div *ngIf="!loading && tickets.length === 0" class="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <p>No Conversations yet. Messages from Instagram & Messenger will appear here.</p>
        </div>

        <div *ngIf="!loading" class="tickets-table">
          <div class="table-row header-row">
            <span>Sender</span>
            <span>ID</span>
            <span>Intent</span>
            <span>Status</span>
            <span></span>
          </div>
          <div *ngFor="let ticket of recentTickets" class="table-row" (click)="goToConversation(ticket.id)">
            <span class="msg-cell">{{ displayName(ticket) }}</span>
            <span class="sender-cell">
              <span class="sender-id">{{ ticket.senderId | slice:0:12 }}...</span>
            </span>
            <span class="intent-cell">
              <span class="intent-tag" [class]="getIntentClass(ticket.intent)">{{ ticket.intent || 'unknown' }}</span>
            </span>
            <span>
              <span class="status-badge" [class.open]="ticket.status === 'OPEN'" [class.closed]="ticket.status === 'CLOSED'">
                {{ ticket.status }}
              </span>
            </span>
            <span class="arrow">→</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Test Modal -->
    <div *ngIf="showTestModal" class="modal-overlay" (click)="showTestModal = false">
      <div class="modal" (click)="stopProp($event)">
        <div class="modal-header">
          <h3>Create Test Conversation</h3>
          <button class="modal-close" (click)="showTestModal = false">✕</button>
        </div>
        <div class="modal-body">
          <label>Message content</label>
          <textarea [(ngModel)]="testMessage" placeholder="Type a message to simulate..." rows="4"></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn-ghost" (click)="showTestModal = false">Cancel</button>
          <button class="btn-primary" (click)="createTestTicket()" [disabled]="!testMessage || creating">
            {{ creating ? 'Creating...' : 'Create' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700;800&display=swap');

    .page {
      padding: 36px 40px;
      font-family: 'DM Sans', sans-serif;
      max-width: 100%;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
    }

    .page-title {
      font-family: 'Syne', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #e8e8f0;
      margin: 0 0 4px;
    }

    .page-sub { color: #6b6b8a; font-size: 14px; margin: 0; }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      border: none;
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s;
      font-family: 'DM Sans', sans-serif;
    }

    .btn-primary:hover { opacity: 0.85; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 36px;
    }

    .stat-card {
      background: #0f0f1a;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      padding: 20px;
      position: relative;
      overflow: hidden;
      transition: border-color 0.2s;
    }

    .stat-card:hover { border-color: rgba(255,255,255,0.12); }

    .stat-label {
      font-size: 12px;
      color: #6b6b8a;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 10px;
    }

    .stat-value {
      font-family: 'Syne', sans-serif;
      font-size: 36px;
      font-weight: 700;
      color: #e8e8f0;
    }

    .stat-value.open { color: #fbbf24; }
    .stat-value.closed { color: #34d399; }
    .stat-value.accent { color: #a5b4fc; }

    .stat-icon {
      position: absolute;
      top: 18px;
      right: 18px;
      opacity: 0.3;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .section-title {
      font-family: 'Syne', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: #e8e8f0;
      margin: 0;
    }

    .view-all {
      color: #a5b4fc;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
    }

    .tickets-table {
      background: #0f0f1a;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      overflow: hidden;
    }

    .table-row {
      display: grid;
      grid-template-columns: 2fr 1.2fr 1fr 0.8fr 40px;
      align-items: center;
      padding: 14px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      font-size: 13px;
      cursor: pointer;
      transition: background 0.15s;
      gap: 12px;
    }

    .table-row:last-child { border-bottom: none; }

    .header-row {
      background: rgba(255,255,255,0.02);
      color: #6b6b8a;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      cursor: default;
    }

    .header-row:hover { background: rgba(255,255,255,0.02) !important; }
    .table-row:not(.header-row):hover { background: rgba(255,255,255,0.03); }

    .msg-cell { color: #c8c8d8; }
    .sender-id { font-size: 11px; color: #6b6b8a; font-family: monospace; }

    .intent-tag {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
      text-transform: capitalize;
    }

    .intent-complaint { background: rgba(239,68,68,0.15); color: #f87171; }
    .intent-question { background: rgba(59,130,246,0.15); color: #60a5fa; }
    .intent-feedback { background: rgba(234,179,8,0.15); color: #fbbf24; }
    .intent-support { background: rgba(139,92,246,0.15); color: #c084fc; }
    .intent-unknown { background: rgba(107,107,138,0.15); color: #9090b0; }
    .intent-default { background: rgba(99,102,241,0.15); color: #a5b4fc; }

    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
    }

    .status-badge.open { background: rgba(251,191,36,0.12); color: #fbbf24; }
    .status-badge.closed { background: rgba(52,211,153,0.12); color: #34d399; }

    .arrow { color: #3a3a5c; font-size: 16px; }
    .table-row:not(.header-row):hover .arrow { color: #a5b4fc; }

    .loading-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 60px 20px;
      color: #6b6b8a;
      font-size: 14px;
      background: #0f0f1a;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
    }

    .spinner {
      width: 28px;
      height: 28px;
      border: 2px solid rgba(255,255,255,0.1);
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }

    .modal {
      background: #13131f;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      width: 480px;
      max-width: 90vw;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }

    .modal-header h3 {
      font-family: 'Syne', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: #e8e8f0;
      margin: 0;
    }

    .modal-close {
      background: none;
      border: none;
      color: #6b6b8a;
      cursor: pointer;
      font-size: 16px;
    }

    .modal-body { padding: 24px; }

    .modal-body label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: #6b6b8a;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }

    .modal-body textarea {
      width: 100%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      color: #e8e8f0;
      padding: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      resize: none;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s;
    }

    .modal-body textarea:focus { border-color: #6366f1; }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 16px 24px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }

    .btn-ghost {
      background: none;
      border: 1px solid rgba(255,255,255,0.1);
      color: #9090b0;
      padding: 9px 16px;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  tickets: Conversation[] = [];
  loading = true;
  showTestModal = false;
  testMessage = '';
  creating = false;
  private pollSub: Subscription | null = null;

  constructor(private svc: ConversationService, private router: Router) {}

  ngOnInit() {
    this.load();
    this.pollSub = interval(2000).subscribe(() => {
      this.svc.getAll().subscribe({
        next: (data) => { this.tickets = data; }
      });
    });
  }

  ngOnDestroy() {
    if (this.pollSub) this.pollSub.unsubscribe();
  }

  load() {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: (data) => { this.tickets = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get recentTickets() { return this.tickets.slice(0, 8); }

  get openCount() { return this.tickets.filter(t => t.status === 'OPEN').length; }

  get closedCount() { return this.tickets.filter(t => t.status === 'CLOSED').length; }

  get uniqueIntents() {
    return new Set(this.tickets.map(t => t.intent).filter(i => i && i !== 'unknown')).size;
  }

  displayName(c: Conversation): string {
    if (c.senderName) return c.senderName;
    if (c.platform === 'TEST') return 'Test User';
    return 'User #' + c.senderId.slice(-6);
  }

  getIntentClass(intent: string): string {
    const map: Record<string, string> = {
      complaint: 'intent-complaint',
      question: 'intent-question',
      feedback: 'intent-feedback',
      support: 'intent-support',
      unknown: 'intent-unknown'
    };
    return map[intent?.toLowerCase()] || 'intent-default';
  }

  goToConversation(id: number) {
    this.router.navigate(['/tickets'], { queryParams: { id } });
  }

  createTestTicket() {
    if (!this.testMessage) return;
    this.creating = true;
    this.svc.createTest(this.testMessage).subscribe({
      next: () => {
        this.creating = false;
        this.showTestModal = false;
        this.testMessage = '';
        this.load();
      },
      error: () => { this.creating = false; }
    });
  }

  stopProp(event: MouseEvent) {
    event.stopPropagation();
  }
}