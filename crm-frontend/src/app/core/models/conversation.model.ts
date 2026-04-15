export type Platform = 'INSTAGRAM' | 'MESSENGER' | 'TEST';
export type Status = 'OPEN' | 'CLOSED';
export type Direction = 'USER' | 'AGENT';

export interface Message {
  id: number;
  content: string;
  direction: Direction;
  createdAt: number;
}

export interface Conversation {
  id: number;
  senderId: string;
  platform: Platform;
  status: Status;
  intent: string;
  confidence: number;
  lastMessageAt: number;
  messages?: Message[];
  senderName?: string;
  messageCount?: number;
}
