import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef,OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Conversation, Message } from '../../core/models/conversation.model';
import { ConversationService } from 'src/app/core/services/conversation.service';
import { interval , Subscription} from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, FormsModule, DatePipe],
  template: `
    <div class="chat-shell">

      <!-- LEFT: Conversation list -->
      <div class="sidebar">
        <div class="sidebar-head">
          <h2 class="sidebar-title">Conversations</h2>
          <button class="btn-new" (click)="showModal = true" title="New test message">+</button>
        </div>

        <div class="search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input [(ngModel)]="search" placeholder="Search..." class="search-input" />
        </div>

        <div class="conv-list">
          <div *ngIf="loading" class="list-loading">
            <div class="spinner"></div>
          </div>

          <div *ngFor="let c of filtered"
               class="conv-item"
               [class.active]="selected?.id === c.id"
               [class.closed]="c.status === 'CLOSED'"
               (click)="selectConversation(c)">

            <div class="conv-avatar" [class]="'avatar-' + c.platform.toLowerCase()">
  {{ (c.senderName || c.senderId).charAt(0).toUpperCase() }}


              <span class="platform-dot" [class]="'dot-' + c.platform.toLowerCase()">
                <svg *ngIf="c.platform === 'INSTAGRAM'" width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5"/></svg>
                <svg *ngIf="c.platform === 'MESSENGER'" width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.45 3.14 7.17l.06 1.59 1.77-.78c.91.25 1.87.38 2.87.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2z"/></svg>
                <svg *ngIf="c.platform === 'TEST'" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              </span>
            </div>

            <div class="conv-info">
              <div class="conv-top">
                <span class="conv-sender">{{ (c.senderName || c.senderId) | slice:0:14 }}{{ (c.senderName || c.senderId).length > 14 ? '...' : '' }}</span>
                <span class="conv-time">{{ formatTime(c.lastMessageAt) }}</span>
              </div>
              <div class="conv-bottom">
                <span class="intent-pill" [class]="getIntentClass(c.intent)">{{ c.intent || 'unknown' }}</span>
                <span class="status-dot-small" [class.open]="c.status==='OPEN'" [class.closed]="c.status==='CLOSED'"></span>
              </div>
            </div>
          </div>

          <div *ngIf="!loading && filtered.length === 0" class="empty-list">
            No conversations yet
          </div>
        </div>
      </div>

      <!-- RIGHT: Chat thread -->
      <div class="chat-area" *ngIf="selected; else noSelection">


        <!-- Chat header -->
        <div class="chat-header">
          <div class="chat-header-left">
            <div class="conv-avatar large" [class]="'avatar-' + selected.platform.toLowerCase()">
  {{ (selected.senderName || selected.senderId).charAt(0).toUpperCase() }}


            </div>
            <div>
              <div class="chat-sender">{{ selected.senderName || selected.senderId }}</div>
              <div class="chat-meta">
                <span class="platform-badge" [class]="'badge-' + selected.platform.toLowerCase()">{{ selected.platform }}</span>
                <span class="intent-pill" [class]="getIntentClass(selected.intent)">{{ selected.intent || 'unknown' }}</span>
              </div>
            </div>
          </div>
          <div class="chat-header-right">
            <span class="status-badge" [class.open]="selected.status==='OPEN'" [class.closed]="selected.status==='CLOSED'">
              {{ selected.status }}
            </span>
            <button *ngIf="selected.status === 'OPEN'" class="btn-close-conv" (click)="closeConv()" [disabled]="acting">
              Close
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div class="messages-area" #scrollRef>
          <div *ngIf="loadingMessages" class="msg-loading">
            <div class="spinner"></div>
          </div>

          <div *ngFor="let msg of messages" class="msg-row" [class.agent]="msg.direction === 'AGENT'">
            <div class="bubble" [class.agent-bubble]="msg.direction === 'AGENT'" [class.user-bubble]="msg.direction === 'USER'">
              <p class="bubble-text">{{ msg.content }}</p>
              <span class="bubble-time">{{ formatTime(msg.createdAt) }}</span>
            </div>
          </div>

          <div *ngIf="!loadingMessages && messages.length === 0" class="no-messages">
            No messages yet
          </div>
        </div>

        <!-- Reply box -->
        <div class="reply-bar" *ngIf="selected.status === 'OPEN'">
          <textarea
            [(ngModel)]="replyText"
            placeholder="Type a reply..."
            class="reply-input"
            rows="1"
            (keydown.enter)="onEnter($event)"
          ></textarea>
          <button class="btn-send" (click)="sendReply()" [disabled]="!replyText.trim() || acting">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>

        <div class="closed-bar" *ngIf="selected.status === 'CLOSED'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          This conversation is closed
        </div>
      </div>

      <!-- No conversation selected -->
      <ng-template #noSelection>
        <div class="no-selection">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <p>Select a conversation to start</p>
        </div>
      </ng-template>
    </div>


    <!-- New Test Modal -->
    <div *ngIf="showModal" class="modal-overlay" (click)="showModal = false">
      <div class="modal" (click)="stopProp($event)">
        <div class="modal-header">
          <h3>New Test Message</h3>
          <button (click)="showModal = false" class="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <label>Message</label>
          <textarea [(ngModel)]="testMessage" rows="4" placeholder="Type a test message..."></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn-ghost" (click)="showModal = false">Cancel</button>
          <button class="btn-primary" (click)="createTest()" [disabled]="!testMessage || creating">
            {{ creating ? 'Sending...' : 'Send' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700;800&display=swap');

    :host { display: flex; height: 100%; font-family: 'DM Sans', sans-serif; }

    .chat-shell {
      display: flex;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    /* ── SIDEBAR ── */
    .sidebar {
      width: 300px;
      min-width: 300px;
      background: #0f0f1a;
      border-right: 1px solid rgba(255,255,255,0.06);
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .sidebar-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 16px 12px;
    }

    .sidebar-title {
      font-family: 'Syne', sans-serif;
      font-size: 16px;
      font-weight: 700;
      color: #e8e8f0;
      margin: 0;
    }

    .btn-new {
      width: 28px; height: 28px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: none;
      border-radius: 7px;
      color: white;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    .search-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 12px 10px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 8px;
      padding: 7px 10px;
      color: #6b6b8a;
    }

    .search-input {
      background: none;
      border: none;
      outline: none;
      color: #e8e8f0;
      font-size: 13px;
      width: 100%;
      font-family: 'DM Sans', sans-serif;
    }

    .search-input::placeholder { color: #4a4a6a; }

    .conv-list {
      flex: 1;
      overflow-y: auto;
      padding: 4px 0;
    }

    .conv-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      cursor: pointer;
      transition: background 0.15s;
      border-bottom: 1px solid rgba(255,255,255,0.03);
    }

    .conv-item:hover { background: rgba(255,255,255,0.03); }
    .conv-item.active { background: rgba(99,102,241,0.1); border-right: 2px solid #6366f1; }
    .conv-item.closed { opacity: 0.5; }

    .conv-avatar {
      width: 38px; height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      color: white;
      position: relative;
      flex-shrink: 0;
    }

    .conv-avatar.large { width: 40px; height: 40px; font-size: 16px; }

    .avatar-instagram { background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); }
    .avatar-messenger { background: linear-gradient(135deg, #0078ff, #00c6ff); }
    .avatar-test { background: linear-gradient(135deg, #6366f1, #8b5cf6); }

    .platform-dot {
      position: absolute;
      bottom: -1px; right: -1px;
      width: 14px; height: 14px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #0f0f1a;
    }


    .dot-instagram { background: #e1306c; color: white; }
    .dot-messenger { background: #0078ff; color: white; }
    .dot-test { background: #6366f1; color: white; }

    .conv-info { flex: 1; min-width: 0; }

    .conv-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .conv-sender { font-size: 13px; font-weight: 500; color: #e8e8f0; }
    .conv-time { font-size: 10px; color: #4a4a6a; }

    .conv-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .intent-pill {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: 500;
      text-transform: capitalize;
    }

    .intent-complaint { background: rgba(239,68,68,0.15); color: #f87171; }
    .intent-question { background: rgba(59,130,246,0.15); color: #60a5fa; }
    .intent-feedback { background: rgba(234,179,8,0.15); color: #fbbf24; }
    .intent-support { background: rgba(139,92,246,0.15); color: #c084fc; }
    .intent-unknown { background: rgba(107,107,138,0.15); color: #9090b0; }
    .intent-default { background: rgba(99,102,241,0.15); color: #a5b4fc; }

    .status-dot-small {
      width: 7px; height: 7px;
      border-radius: 50%;
    }
    .status-dot-small.open { background: #fbbf24; }
    .status-dot-small.closed { background: #34d399; }

    .list-loading, .empty-list {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px 20px;
      color: #4a4a6a;
      font-size: 13px;
    }

    /* ── CHAT AREA ── */
    .chat-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      background: #0f0f1a;
      flex-shrink: 0;
    }

    .chat-header-left { display: flex; align-items: center; gap: 12px; }

    .chat-sender {
      font-family: 'Syne', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #e8e8f0;
      font-family: monospace;
    }

    .chat-meta { display: flex; align-items: center; gap: 6px; margin-top: 3px; }

    .platform-badge {
      display: inline-block;
      padding: 1px 7px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.04em;
    }

    .badge-instagram { background: rgba(225,48,108,0.15); color: #f06292; }
    .badge-messenger { background: rgba(0,120,255,0.15); color: #64b5f6; }
    .badge-test { background: rgba(99,102,241,0.15); color: #a5b4fc; }

    .chat-header-right { display: flex; align-items: center; gap: 10px; }

    .status-badge {
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 500;
    }
    .status-badge.open { background: rgba(251,191,36,0.12); color: #fbbf24; }
    .status-badge.closed { background: rgba(52,211,153,0.12); color: #34d399; }

    .btn-close-conv {
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.2);
      color: #f87171;
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      transition: all 0.2s;
    }
    .btn-close-conv:hover { background: rgba(239,68,68,0.2); }
    .btn-close-conv:disabled { opacity: 0.4; cursor: not-allowed; }

    /* ── MESSAGES ── */
    .messages-area {
      flex: 1;
      overflow-y: auto;
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .msg-row {
      display: flex;
      justify-content: flex-start;
    }

    .msg-row.agent { justify-content: flex-end; }

    .bubble {
      max-width: 65%;
      padding: 10px 14px;
      border-radius: 14px;
      position: relative;
    }


    .user-bubble {
      background: #1a1a2e;
      border: 1px solid rgba(255,255,255,0.07);
      border-bottom-left-radius: 4px;
    }

    .agent-bubble {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      border-bottom-right-radius: 4px;
    }

    .bubble-text {
      margin: 0 0 4px;
      font-size: 14px;
      line-height: 1.5;
      color: #e8e8f0;
    }

    .bubble-time {
      font-size: 10px;
      color: rgba(255,255,255,0.4);
      display: block;
      text-align: right;
    }

    .msg-loading, .no-messages {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px;
      color: #4a4a6a;
      font-size: 13px;
    }

    /* ── REPLY BAR ── */
    .reply-bar {
      display: flex;
      align-items: flex-end;
      gap: 10px;
      padding: 12px 16px;
      border-top: 1px solid rgba(255,255,255,0.06);
      background: #0f0f1a;
      flex-shrink: 0;
    }

    .reply-input {
      flex: 1;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      color: #e8e8f0;
      padding: 10px 14px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      resize: none;
      outline: none;
      transition: border-color 0.2s;
      max-height: 120px;
    }

    .reply-input:focus { border-color: #6366f1; }
    .reply-input::placeholder { color: #4a4a6a; }

    .btn-send {
      width: 40px; height: 40px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: none;
      border-radius: 10px;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s;
      flex-shrink: 0;
    }

    .btn-send:hover { opacity: 0.85; }
    .btn-send:disabled { opacity: 0.4; cursor: not-allowed; }

    .closed-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 14px;
      border-top: 1px solid rgba(255,255,255,0.06);
      color: #34d399;
      font-size: 13px;
      background: rgba(52,211,153,0.05);
      flex-shrink: 0;
    }

    /* ── NO SELECTION ── */
    .no-selection {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
      color: #3a3a5c;
      font-size: 14px;
    }

    /* ── SPINNER ── */
    .spinner {
      width: 24px; height: 24px;
      border: 2px solid rgba(255,255,255,0.08);
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── MODAL ── */
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      z-index: 200;
    }

    .modal {
      background: #13131f;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      width: 460px; max-width: 90vw;
    }

    .modal-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 18px 22px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }

    .modal-header h3 {
      font-family: 'Syne', sans-serif;
      font-size: 15px; font-weight: 600; color: #e8e8f0; margin: 0;
    }

    .modal-close {
      background: none; border: none; color: #6b6b8a; cursor: pointer; font-size: 16px;
    }

    .modal-body { padding: 20px 22px; }

    .modal-body label {
      display: block; font-size: 11px; color: #6b6b8a;
      text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 7px;
    }

    .modal-body textarea {
      width: 100%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      color: #e8e8f0; padding: 10px 12px;
      font-family: 'DM Sans', sans-serif; font-size: 13px;
      resize: none; outline: none; box-sizing: border-box;
      transition: border-color 0.2s;
    }


    .modal-body textarea:focus { border-color: #6366f1; }

    .modal-footer {
      display: flex; justify-content: flex-end; gap: 8px;
      padding: 14px 22px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }

    .btn-ghost {
      background: none; border: 1px solid rgba(255,255,255,0.08);
      color: #9090b0; padding: 8px 14px; border-radius: 7px;
      font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif;
    }

    .btn-primary {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white; border: none; padding: 8px 16px;
      border-radius: 7px; font-size: 13px; font-weight: 500;
      cursor: pointer; font-family: 'DM Sans', sans-serif;
      transition: opacity 0.2s;
    }

    .btn-primary:hover { opacity: 0.85; }
    .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
  `]
})
export class ConversationsComponent implements OnDestroy,OnInit, AfterViewChecked {
  @ViewChild('scrollRef') scrollRef!: ElementRef;

  conversations: Conversation[] = [];
  filtered: Conversation[] = [];
  selected: Conversation | null = null;
  messages: Message[] = [];

  loading = true;
  loadingMessages = false;
  acting = false;

  search = '';
  replyText = '';

  showModal = false;
  testMessage = '';
  creating = false;

  private shouldScroll = false;
  private pollSub: Subscription | null = null;
 private messagePollSub: Subscription | null = null;

  constructor(private svc: ConversationService,private route:ActivatedRoute) {}

ngOnInit() {
  this.load();
  this.pollSub = interval(1000).subscribe(() => {
    this.svc.getAll().subscribe({
      next: (data) => { this.conversations = data; this.applyFilter(); }
    });
  });
}


  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  load() {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: (data) => { this.conversations = data; this.applyFilter(); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  applyFilter() {
    this.filtered = this.conversations.filter(c => {
  const term = this.search.toLowerCase();
  return !this.search ||
    c.senderId.toLowerCase().includes(term) ||
    (c.senderName || '').toLowerCase().includes(term);
});

  }

  selectConversation(c: Conversation) {
  this.selected = c;
  this.loadingMessages = true;

  if (this.messagePollSub) {
    this.messagePollSub.unsubscribe();
  }

  this.svc.getMessages(c.id).subscribe({
    next: (msgs) => {
      this.messages = msgs;
      this.loadingMessages = false;
      this.shouldScroll = true;
    },
    error: () => { this.loadingMessages = false; }
  });

  this.messagePollSub = interval(3000).subscribe(() => {
    if (!this.selected) return;
    this.svc.getMessages(this.selected.id).subscribe({
      next: (msgs) => {
        if (msgs.length !== this.messages.length) {
          this.messages = msgs;
          this.shouldScroll = true;
        }
      }
    });
  });
}

  sendReply() {
    if (!this.selected || !this.replyText.trim()) return;
    this.acting = true;
    this.svc.reply(this.selected.id, this.replyText).subscribe({
      next: (updated) => {
        this.selected = updated;
        this.messages.push({
          id: Date.now(),
          content: this.replyText,
          direction: 'AGENT',
          createdAt: Date.now()
        });
        this.replyText = '';
        this.acting = false;
        this.shouldScroll = true;
        // Update conversation in list
        const idx = this.conversations.findIndex(c => c.id === updated.id);
        if (idx !== -1) this.conversations[idx] = updated;
      },
      error: () => { this.acting = false; }
    });
  }

  closeConv() {
    if (!this.selected) return;
    this.acting = true;
    this.svc.close(this.selected.id).subscribe({
      next: (updated) => {
        this.selected = updated;
        this.acting = false;
        const idx = this.conversations.findIndex(c => c.id === updated.id);
        if (idx !== -1) this.conversations[idx] = updated;
      },
      error: () => { this.acting = false; }
    });
  }

  createTest() {
    if (!this.testMessage) return;
    this.creating = true;
    this.svc.createTest(this.testMessage).subscribe({
      next: (conv) => {
        this.creating = false;
        this.showModal = false;
        this.testMessage = '';
        this.load();
      },
      error: () => { this.creating = false; }
    });
  }

  onEnter(event: Event) {
  const e = event as KeyboardEvent;
  if (!e.shiftKey) {
    e.preventDefault();
    this.sendReply();
  }
}
  ngOnDestroy() {
  if (this.pollSub) this.pollSub.unsubscribe();
  if (this.messagePollSub) this.messagePollSub.unsubscribe();
}

  scrollToBottom() {
    try {
      const el = this.scrollRef.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch {}
  }


  formatTime(ts: number): string {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  getIntentClass(intent: string): string {
    const map: Record<string, string> = {
      complaint: 'intent-complaint', question: 'intent-question',
      feedback: 'intent-feedback', support: 'intent-support', unknown: 'intent-unknown'
    };
    return map[intent?.toLowerCase()] || 'intent-default';
  }
  stopProp(event: MouseEvent) {
  event.stopPropagation();
}
}
