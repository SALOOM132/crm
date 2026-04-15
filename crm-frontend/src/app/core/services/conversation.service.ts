import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conversation, Message } from '../models/conversation.model';

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private base = 'https://wade-nonauthentical-yawnfully.ngrok-free.dev';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.base}/conversations`);
  }

  getById(id: number): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.base}/conversations/${id}`);
  }

  getMessages(id: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.base}/conversations/${id}/messages`);
  }

  reply(id: number, reply: string): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.base}/conversations/${id}/reply`, { reply });
  }

  close(id: number): Observable<Conversation> {
    return this.http.patch<Conversation>(`${this.base}/conversations/${id}/close`, {});
  }

  createTest(content: string): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.base}/test`, { content });
  }
}
