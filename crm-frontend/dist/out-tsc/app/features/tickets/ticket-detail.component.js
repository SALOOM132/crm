import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
let TicketDetailComponent = class TicketDetailComponent {
    constructor(route, ticketService) {
        this.route = route;
        this.ticketService = ticketService;
        this.ticket = null;
        this.loading = true;
        this.replyText = '';
        this.acting = false;
    }
    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.ticketService.getTicketById(id).subscribe({
            next: (t) => { this.ticket = t; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }
    sendReply() {
        if (!this.ticket || !this.replyText)
            return;
        this.acting = true;
        this.ticketService.replyToTicket(this.ticket.id, { reply: this.replyText }).subscribe({
            next: (t) => { this.ticket = t; this.acting = false; this.replyText = ''; },
            error: () => { this.acting = false; }
        });
    }
    closeOnly() {
        if (!this.ticket)
            return;
        this.acting = true;
        this.ticketService.closeTicket(this.ticket.id).subscribe({
            next: (t) => { this.ticket = t; this.acting = false; },
            error: () => { this.acting = false; }
        });
    }
    getIntentClass(intent) {
        const map = {
            complaint: 'intent-complaint', question: 'intent-question',
            feedback: 'intent-feedback', support: 'intent-support', unknown: 'intent-unknown'
        };
        return map[intent?.toLowerCase()] || 'intent-default';
    }
    getConfidenceClass(conf) {
        if (conf >= 0.7)
            return 'conf-high';
        if (conf >= 0.4)
            return 'conf-mid';
        return 'conf-low';
    }
};
TicketDetailComponent = __decorate([
    Component({
        selector: 'app-ticket-detail',
        standalone: true,
        imports: [CommonModule, NgIf, RouterLink, FormsModule], template: `
    <div class="page">
      <div class="back-nav">
        <a routerLink="/tickets" class="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Tickets
        </a>
      </div>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
      </div>

      <div *ngIf="!loading && ticket" class="detail-layout">
        <!-- Main -->
        <div class="main-col">
          <div class="ticket-header">
            <div class="header-top">
              <span class="ticket-id">#{{ ticket.id }}</span>
              <span class="status-badge" [class.open]="ticket.status === 'OPEN'" [class.closed]="ticket.status === 'CLOSED'">
                {{ ticket.status }}
              </span>
            </div>
            <h1 class="ticket-title">Ticket from {{ ticket.senderId }}</h1>
          </div>

          <!-- Message bubble -->
          <div class="message-section">
            <div class="section-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Incoming Message
            </div>
            <div class="message-bubble incoming">
              <div class="bubble-sender">
                <div class="avatar">{{ ticket.senderId?.charAt(0)?.toUpperCase() }}</div>
                <span>{{ ticket.senderId }}</span>
              </div>
              <p class="bubble-text">{{ ticket.message }}</p>
            </div>
          </div>

          <!-- Reply section -->
          <div class="reply-section" *ngIf="ticket.status === 'OPEN'">
            <div class="section-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
              Send Reply
            </div>
            <textarea
              [(ngModel)]="replyText"
              placeholder="Type your reply..."
              rows="5"
              class="reply-input"
            ></textarea>
            <div class="reply-actions">
              <button class="btn-close-only" (click)="closeOnly()" [disabled]="acting">
                Close without reply
              </button>
              <button class="btn-reply" (click)="sendReply()" [disabled]="!replyText || acting">
                {{ acting ? 'Sending...' : 'Send & Close' }}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>

          <!-- Existing reply -->
          <div class="message-section" *ngIf="ticket.reply">
            <div class="section-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
              Reply Sent
            </div>
            <div class="message-bubble reply">
              <div class="bubble-sender agent">
                <div class="avatar agent-avatar">A</div>
                <span>Agent</span>
              </div>
              <p class="bubble-text">{{ ticket.reply }}</p>
            </div>
          </div>
        </div>

        <!-- Sidebar info -->
        <div class="info-col">
          <div class="info-card">
            <div class="info-title">Ticket Details</div>

            <div class="info-row">
              <span class="info-label">Status</span>
              <span class="status-badge" [class.open]="ticket.status === 'OPEN'" [class.closed]="ticket.status === 'CLOSED'">{{ ticket.status }}</span>
            </div>

            <div class="info-row">
              <span class="info-label">Sender ID</span>
              <span class="info-value mono">{{ ticket.senderId }}</span>
            </div>

            <div class="info-row">
              <span class="info-label">Ticket ID</span>
              <span class="info-value mono">#{{ ticket.id }}</span>
            </div>
          </div>

          <div class="info-card ml-card">
            <div class="info-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              ML Analysis
            </div>

            <div class="intent-display">
              <div class="intent-label">Detected Intent</div>
              <div class="intent-value" [class]="getIntentClass(ticket.intent)">
                {{ ticket.intent || 'unknown' }}
              </div>
            </div>

            <div class="confidence-display">
              <div class="conf-label-row">
                <span class="intent-label">Confidence</span>
                <span class="conf-pct">{{ (ticket.confidence * 100).toFixed(0) }}%</span>
              </div>
              <div class="conf-bar">
                <div class="conf-fill" [style.width.%]="ticket.confidence * 100" [class]="getConfidenceClass(ticket.confidence)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !ticket" class="empty-state">
        <p>Ticket not found.</p>
        <a routerLink="/tickets" class="back-link">← Back to list</a>
      </div>
    </div>
  `,
        styles: [`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700;800&display=swap');

    .page {
      padding: 32px 40px;
      font-family: 'DM Sans', sans-serif;
      max-width: 1100px;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #6b6b8a;
      text-decoration: none;
      font-size: 13px;
      margin-bottom: 24px;
      transition: color 0.15s;
    }
    .back-link:hover { color: #a5b4fc; }

    .detail-layout {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 24px;
      align-items: start;
    }

    .ticket-header {
      margin-bottom: 24px;
    }

    .header-top {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }

    .ticket-id { font-family: monospace; font-size: 12px; color: #4a4a6a; }

    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.05em;
    }
    .status-badge.open { background: rgba(251,191,36,0.12); color: #fbbf24; }
    .status-badge.closed { background: rgba(52,211,153,0.12); color: #34d399; }

    .ticket-title {
      font-family: 'Syne', sans-serif;
      font-size: 22px;
      font-weight: 600;
      color: #e8e8f0;
      margin: 0;
    }

    .section-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #6b6b8a;
      margin-bottom: 10px;
    }

    .message-section { margin-bottom: 24px; }

    .message-bubble {
      background: #0f0f1a;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      padding: 18px;
    }

    .message-bubble.reply {
      border-color: rgba(99,102,241,0.2);
      background: rgba(99,102,241,0.05);
    }

    .bubble-sender {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .bubble-sender span { font-size: 12px; color: #6b6b8a; font-family: monospace; }

    .avatar {
      width: 28px;
      height: 28px;
      background: rgba(251,191,36,0.2);
      color: #fbbf24;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
    }

    .agent-avatar {
      background: rgba(99,102,241,0.2);
      color: #a5b4fc;
    }

    .bubble-text {
      color: #c8c8d8;
      font-size: 15px;
      line-height: 1.6;
      margin: 0;
    }

    .reply-section {
      margin-bottom: 24px;
    }

    .reply-input {
      width: 100%;
      background: #0f0f1a;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      color: #e8e8f0;
      padding: 14px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      resize: none;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .reply-input:focus { border-color: #6366f1; }
    .reply-input::placeholder { color: #4a4a6a; }

    .reply-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 10px;
    }

    .btn-close-only {
      background: none;
      border: 1px solid rgba(255,255,255,0.08);
      color: #9090b0;
      padding: 9px 14px;
      border-radius: 8px;
      font-size: 13px;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      transition: all 0.2s;
    }
    .btn-close-only:hover { color: #e8e8f0; border-color: rgba(255,255,255,0.15); }
    .btn-close-only:disabled { opacity: 0.4; cursor: not-allowed; }

    .btn-reply {
      display: flex;
      align-items: center;
      gap: 7px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      border: none;
      padding: 9px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      transition: opacity 0.2s;
    }
    .btn-reply:hover { opacity: 0.85; }
    .btn-reply:disabled { opacity: 0.4; cursor: not-allowed; }

    /* Info sidebar */
    .info-card {
      background: #0f0f1a;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      padding: 18px;
      margin-bottom: 14px;
    }

    .info-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #6b6b8a;
      margin-bottom: 16px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .info-row:last-child { border-bottom: none; }

    .info-label { font-size: 12px; color: #6b6b8a; }
    .info-value { font-size: 12px; color: #c8c8d8; }
    .info-value.mono { font-family: monospace; font-size: 11px; }

    .intent-display { margin-bottom: 16px; }
    .intent-label { font-size: 11px; color: #6b6b8a; margin-bottom: 8px; }

    .intent-value {
      display: inline-block;
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      text-transform: capitalize;
    }

    .intent-complaint { background: rgba(239,68,68,0.15); color: #f87171; }
    .intent-question { background: rgba(59,130,246,0.15); color: #60a5fa; }
    .intent-feedback { background: rgba(234,179,8,0.15); color: #fbbf24; }
    .intent-support { background: rgba(139,92,246,0.15); color: #c084fc; }
    .intent-unknown { background: rgba(107,107,138,0.15); color: #9090b0; }
    .intent-default { background: rgba(99,102,241,0.15); color: #a5b4fc; }

    .conf-label-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .conf-pct { font-size: 12px; color: #c8c8d8; font-weight: 500; }

    .conf-bar {
      height: 6px;
      background: rgba(255,255,255,0.06);
      border-radius: 3px;
      overflow: hidden;
    }

    .conf-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.6s ease;
    }

    .conf-high { background: linear-gradient(90deg, #34d399, #6ee7b7); }
    .conf-mid { background: linear-gradient(90deg, #fbbf24, #fde68a); }
    .conf-low { background: linear-gradient(90deg, #f87171, #fca5a5); }

    .loading-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 80px 20px;
      color: #6b6b8a;
    }

    .spinner {
      width: 28px; height: 28px;
      border: 2px solid rgba(255,255,255,0.1);
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  `]
    })
], TicketDetailComponent);
export { TicketDetailComponent };
//# sourceMappingURL=ticket-detail.component.js.map