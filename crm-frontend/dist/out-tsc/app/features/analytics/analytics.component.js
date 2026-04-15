import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
let AnalyticsComponent = class AnalyticsComponent {
    constructor(ticketService) {
        this.ticketService = ticketService;
        this.tickets = [];
        this.loading = true;
    }
    ngOnInit() {
        this.ticketService.getAllTickets().subscribe({
            next: (data) => { this.tickets = data; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }
    get openCount() { return this.tickets.filter(t => t.status === 'OPEN').length; }
    get closedCount() { return this.tickets.filter(t => t.status === 'CLOSED').length; }
    get resolutionRate() {
        if (!this.tickets.length)
            return 0;
        return ((this.closedCount / this.tickets.length) * 100).toFixed(0);
    }
    get intentData() {
        const counts = {};
        this.tickets.forEach(t => {
            const i = t.intent || 'unknown';
            counts[i] = (counts[i] || 0) + 1;
        });
        const total = this.tickets.length || 1;
        return Object.entries(counts)
            .map(([intent, count]) => ({ intent, count, pct: (count / total) * 100 }))
            .sort((a, b) => b.count - a.count);
    }
    get openArc() {
        if (!this.tickets.length)
            return 0;
        return (this.openCount / this.tickets.length) * 283;
    }
    get closedArc() {
        if (!this.tickets.length)
            return 0;
        return (this.closedCount / this.tickets.length) * 283;
    }
    get senderData() {
        const counts = {};
        this.tickets.forEach(t => {
            counts[t.senderId] = (counts[t.senderId] || 0) + 1;
        });
        const max = Math.max(...Object.values(counts), 1);
        return Object.entries(counts)
            .map(([senderId, count]) => ({ senderId, count, pct: (count / max) * 100 }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);
    }
    getIntentClass(intent) {
        const map = {
            complaint: 'intent-complaint', question: 'intent-question',
            feedback: 'intent-feedback', support: 'intent-support', unknown: 'intent-unknown'
        };
        return map[intent?.toLowerCase()] || 'intent-default';
    }
};
AnalyticsComponent = __decorate([
    Component({
        selector: 'app-analytics',
        standalone: true,
        imports: [CommonModule, NgIf, NgFor], template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Analytics</h1>
          <p class="page-sub">Intent distribution & ticket insights</p>
        </div>
      </div>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
      </div>

      <div *ngIf="!loading">
        <!-- Summary row -->
        <div class="summary-row">
          <div class="sum-card">
            <div class="sum-num">{{ tickets.length }}</div>
            <div class="sum-label">Total Tickets</div>
          </div>
          <div class="sum-card">
            <div class="sum-num open">{{ openCount }}</div>
            <div class="sum-label">Open</div>
          </div>
          <div class="sum-card">
            <div class="sum-num closed">{{ closedCount }}</div>
            <div class="sum-label">Resolved</div>
          </div>
          <div class="sum-card">
            <div class="sum-num rate">{{ resolutionRate }}%</div>
            <div class="sum-label">Resolution Rate</div>
          </div>
        </div>

        <!-- Charts row -->
        <div class="charts-row">
          <!-- Intent breakdown -->
          <div class="chart-card wide">
            <div class="chart-title">Intent Breakdown</div>
            <div *ngIf="intentData.length === 0" class="no-data">No data yet</div>
            <div class="intent-bars">
              <div *ngFor="let item of intentData" class="intent-bar-row">
                <div class="intent-name">
                  <span class="intent-dot" [class]="getIntentClass(item.intent)"></span>
                  {{ item.intent }}
                </div>
                <div class="bar-track">
                  <div class="bar-fill" [class]="getIntentClass(item.intent)" [style.width.%]="item.pct"></div>
                </div>
                <div class="bar-count">{{ item.count }}</div>
                <div class="bar-pct">{{ item.pct.toFixed(0) }}%</div>
              </div>
            </div>
          </div>

          <!-- Status donut visual -->
          <div class="chart-card">
            <div class="chart-title">Status Split</div>
            <div class="donut-wrap">
              <svg viewBox="0 0 120 120" class="donut-svg">
                <!-- Background circle -->
                <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="14"/>
                <!-- Open arc -->
                <circle cx="60" cy="60" r="45" fill="none"
                  stroke="#fbbf24" stroke-width="14"
                  [attr.stroke-dasharray]="openArc + ' ' + (283 - openArc)"
                  stroke-dashoffset="71"
                  stroke-linecap="round"/>
                <!-- Closed arc -->
                <circle cx="60" cy="60" r="45" fill="none"
                  stroke="#34d399" stroke-width="14"
                  [attr.stroke-dasharray]="closedArc + ' ' + (283 - closedArc)"
[attr.stroke-dashoffset]="71 - openArc"
                  stroke-linecap="round"/>
                <text x="60" y="56" text-anchor="middle" fill="#e8e8f0" font-size="18" font-weight="600" font-family="Syne, sans-serif">{{ tickets.length }}</text>
                <text x="60" y="70" text-anchor="middle" fill="#6b6b8a" font-size="9" font-family="DM Sans, sans-serif">tickets</text>
              </svg>
              <div class="donut-legend">
                <div class="legend-item">
                  <span class="legend-dot open"></span>
                  <span>Open ({{ openCount }})</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot closed"></span>
                  <span>Closed ({{ closedCount }})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top senders -->
        <div class="chart-card full">
          <div class="chart-title">Top Senders</div>
          <div *ngIf="senderData.length === 0" class="no-data">No data yet</div>
          <div class="senders-grid">
            <div *ngFor="let s of senderData; let i = index" class="sender-row">
              <span class="sender-rank">{{ i + 1 }}</span>
              <span class="sender-id">{{ s.senderId }}</span>
              <div class="sender-bar-track">
                <div class="sender-bar-fill" [style.width.%]="s.pct"></div>
              </div>
              <span class="sender-count">{{ s.count }} tickets</span>
            </div>
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
      max-width: 1100px;
    }

    .page-title {
      font-family: 'Syne', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #e8e8f0;
      margin: 0 0 4px;
    }
    .page-sub { color: #6b6b8a; font-size: 13px; margin: 0 0 28px; }

    .summary-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 24px;
    }

    .sum-card {
      background: #0f0f1a;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }

    .sum-num {
      font-family: 'Syne', sans-serif;
      font-size: 40px;
      font-weight: 700;
      color: #e8e8f0;
    }
    .sum-num.open { color: #fbbf24; }
    .sum-num.closed { color: #34d399; }
    .sum-num.rate { color: #a5b4fc; }
    .sum-label { font-size: 11px; color: #6b6b8a; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; }

    .charts-row {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 16px;
      margin-bottom: 16px;
    }

    .chart-card {
      background: #0f0f1a;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      padding: 20px;
    }

    .chart-card.full { margin-bottom: 0; }

    .chart-title {
      font-family: 'Syne', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: #9090b0;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 20px;
    }

    .no-data { color: #4a4a6a; font-size: 13px; text-align: center; padding: 30px 0; }

    /* Intent bars */
    .intent-bars { display: flex; flex-direction: column; gap: 14px; }

    .intent-bar-row {
      display: grid;
      grid-template-columns: 130px 1fr 40px 44px;
      align-items: center;
      gap: 12px;
    }

    .intent-name {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 13px;
      color: #c8c8d8;
      text-transform: capitalize;
    }

    .intent-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }

    .bar-track {
      height: 8px;
      background: rgba(255,255,255,0.05);
      border-radius: 4px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.8s ease;
    }

    .bar-count { font-size: 13px; color: #9090b0; text-align: right; }
    .bar-pct { font-size: 11px; color: #6b6b8a; text-align: right; }

    /* Intent color dots & bars */
    .intent-complaint, .intent-dot.intent-complaint { background: #f87171; }
    .intent-question, .intent-dot.intent-question { background: #60a5fa; }
    .intent-feedback, .intent-dot.intent-feedback { background: #fbbf24; }
    .intent-support, .intent-dot.intent-support { background: #c084fc; }
    .intent-unknown, .intent-dot.intent-unknown { background: #6b6b8a; }
    .intent-default, .intent-dot.intent-default { background: #a5b4fc; }

    .bar-fill.intent-complaint { background: linear-gradient(90deg, #f87171, #fca5a5); }
    .bar-fill.intent-question { background: linear-gradient(90deg, #60a5fa, #93c5fd); }
    .bar-fill.intent-feedback { background: linear-gradient(90deg, #fbbf24, #fde68a); }
    .bar-fill.intent-support { background: linear-gradient(90deg, #c084fc, #d8b4fe); }
    .bar-fill.intent-unknown { background: linear-gradient(90deg, #6b6b8a, #9090b0); }
    .bar-fill.intent-default { background: linear-gradient(90deg, #6366f1, #a5b4fc); }

    /* Donut */
    .donut-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .donut-svg {
      width: 140px;
      height: 140px;
      transform: rotate(-90deg);
    }

    .donut-svg text {
      transform: rotate(90deg);
      transform-origin: 60px 60px;
    }

    .donut-legend {
      display: flex;
      gap: 16px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #9090b0;
    }

    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }
    .legend-dot.open { background: #fbbf24; }
    .legend-dot.closed { background: #34d399; }

    /* Senders */
    .senders-grid { display: flex; flex-direction: column; gap: 10px; }

    .sender-row {
      display: grid;
      grid-template-columns: 24px 200px 1fr 100px;
      align-items: center;
      gap: 12px;
      font-size: 13px;
    }

    .sender-rank { color: #4a4a6a; font-weight: 600; }
    .sender-id { font-family: monospace; color: #c8c8d8; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    .sender-bar-track {
      height: 6px;
      background: rgba(255,255,255,0.05);
      border-radius: 3px;
      overflow: hidden;
    }

    .sender-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #6366f1, #a5b4fc);
      border-radius: 3px;
      transition: width 0.8s ease;
    }

    .sender-count { font-size: 11px; color: #6b6b8a; text-align: right; }

    .loading-state {
      display: flex;
      justify-content: center;
      padding: 80px;
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
], AnalyticsComponent);
export { AnalyticsComponent };
//# sourceMappingURL=analytics.component.js.map