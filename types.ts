export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isTyping?: boolean;
}

export enum BotCommand {
  SAVE_STATE = 'Save State',
  BUILD = 'Собери проект',
  TEXTBOOK = 'Textbook',
  FAST_TRACK = 'Yes, Code it.'
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}