import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
let TicketsListComponent = class TicketsListComponent {
    constructor(ticketService) {
        this.ticketService = ticketService;
        this.tickets = [];
        this.filtered = [];
        this.loading = true;
        this.searchQuery = '';
        this.statusFilter = 'ALL';
        this.intentFilter = '';
    }
    ngOnInit() { this.load(); }
    load() {
        this.loading = true;
        this.ticketService.getAllTickets().subscribe({
            next: (data) => {
                this.tickets = data.reverse();
                this.applyFilters();
                this.loading = false;
            },
            error: () => { this.loading = false; }
        });
    }
    get availableIntents() {
        return [...new Set(this.tickets.map(t => t.intent).filter(Boolean))];
    }
    setStatus(s) {
        this.statusFilter = s;
        this.applyFilters();
    }
    applyFilters() {
        this.filtered = this.tickets.filter(t => {
            const matchSearch = !this.searchQuery ||
                t.message?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                t.senderId?.toLowerCase().includes(this.searchQuery.toLowerCase());
            const matchStatus = this.statusFilter === 'ALL' || t.status === this.statusFilter;
            const matchIntent = !this.intentFilter || t.intent === this.intentFilter;
            return matchSearch && matchStatus && matchIntent;
        });
    }
    getIntentClass(intent) {
        const map = {
            complaint: 'intent-complaint', question: 'intent-question',
            feedback: 'intent-feedback', support: 'intent-support', unknown: 'intent-unknown'
        };
        return map[intent?.toLowerCase()] || 'intent-default';
    }
};
TicketsListComponent = __decorate([
    Component({
        selector: 'app-tickets-list',
        standalone: true,
        imports: [CommonModule, NgIf, NgFor, RouterLink, FormsModule], template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Tickets</h1>
          <p class="page-sub">{{ filtered.length }} of {{ tickets.length }} tickets</p>
        </div>
        <div class="header-actions">
          <button class="btn-refresh" (click)="load()" title="Refresh">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input [(ngModel)]="searchQuery" placeholder="Search tickets..." (input)="applyFilters()" />
        </div>

        <div class="filter-tabs">
          <button [class.active]="statusFilter === 'ALL'" (click)="setStatus('ALL')">All</button>
          <button [class.active]="statusFilter === 'OPEN'" (click)="setStatus('OPEN')">
            <span class="dot open"></span> Open
          </button>
          <button [class.active]="statusFilter === 'CLOSED'" (click)="setStatus('CLOSED')">
            <span class="dot closed"></span> Closed
          </button>
        </div>

        <select [(ngModel)]="intentFilter" (change)="applyFilters()" class="intent-select">
          <option value="">All intents</option>
          <option *ngFor="let i of availableIntents" [value]="i">{{ i }}</option>
        </select>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <span>Fetching tickets...</span>
      </div>

      <!-- Empty -->
      <div *ngIf="!loading && filtered.length === 0" class="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <p>No tickets match your filters.</p>
      </div>

      <!-- Ticket cards -->
      <div *ngIf="!loading" class="ticket-list">
        <div *ngFor="let ticket of filtered" class="ticket-card" [routerLink]="['/tickets', ticket.id]">
          <div class="ticket-top">
            <div class="ticket-meta">
              <span class="ticket-id">#{{ ticket.id }}</span>
              <span class="source-icon" title="Source">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </span>
              <span class="sender">{{ ticket.senderId }}</span>
            </div>
            <div class="ticket-right">
              <span class="status-badge" [class.open]="ticket.status === 'OPEN'" [class.closed]="ticket.status === 'CLOSED'">
                {{ ticket.status }}
              </span>
            </div>
          </div>

          <div class="ticket-message">{{ ticket.message }}</div>

          <div class="ticket-footer">
            <span class="intent-tag" [class]="getIntentClass(ticket.intent)">
              {{ ticket.intent || 'unknown' }}
            </span>
            <span class="ticket-arrow">View →</span>
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
      max-width: 1000px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 28px;
    }

    .page-title {
      font-family: 'Syne', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #e8e8f0;
      margin: 0 0 4px;
    }

    .page-sub { color: #6b6b8a; font-size: 13px; margin: 0; }

    .btn-refresh {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      color: #9090b0;
      border-radius: 8px;
      padding: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: all 0.2s;
    }
    .btn-refresh:hover { color: #e8e8f0; background: rgba(255,255,255,0.08); }

    .filters {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #0f0f1a;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      padding: 8px 14px;
      flex: 1;
      min-width: 200px;
      color: #6b6b8a;
    }

    .search-box input {
      background: none;
      border: none;
      outline: none;
      color: #e8e8f0;
      font-size: 13px;
      width: 100%;
      font-family: 'DM Sans', sans-serif;
    }

    .search-box input::placeholder { color: #4a4a6a; }

    .filter-tabs {
      display: flex;
      background: #0f0f1a;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px;
      padding: 3px;
      gap: 2px;
    }

    .filter-tabs button {
      display: flex;
      align-items: center;
      gap: 5px;
      background: none;
      border: none;
      color: #6b6b8a;
      padding: 6px 12px;
      border-radius: 5px;
      font-size: 13px;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      transition: all 0.15s;
    }

    .filter-tabs button.active {
      background: rgba(255,255,255,0.07);
      color: #e8e8f0;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      display: inline-block;
    }
    .dot.open { background: #fbbf24; }
    .dot.closed { background: #34d399; }

    .intent-select {
      background: #0f0f1a;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      color: #9090b0;
      padding: 8px 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      outline: none;
      cursor: pointer;
    }

    .ticket-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 12px;
    }

    .ticket-card {
      background: #0f0f1a;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      padding: 18px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .ticket-card:hover {
      border-color: rgba(99,102,241,0.3);
      transform: translateY(-1px);
      box-shadow: 0 4px 20px rgba(99,102,241,0.08);
    }

    .ticket-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .ticket-meta {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .ticket-id {
      font-family: monospace;
      font-size: 11px;
      color: #4a4a6a;
    }

    .source-icon { color: #4a4a6a; display: flex; align-items: center; }

    .sender {
      font-size: 12px;
      color: #6b6b8a;
      font-family: monospace;
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

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

    .ticket-message {
      font-size: 14px;
      color: #c8c8d8;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .ticket-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .intent-tag {
      display: inline-block;
      padding: 3px 9px;
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

    .ticket-arrow { font-size: 13px; color: #3a3a5c; }
    .ticket-card:hover .ticket-arrow { color: #a5b4fc; }

    .loading-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 80px 20px;
      color: #6b6b8a;
      font-size: 14px;
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
], TicketsListComponent);
export { TicketsListComponent };
//# sourceMappingURL=tickets-list.component.js.map