
export interface CardType {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export enum PageState {
  HOME = 'HOME',
  ENVELOPE = 'ENVELOPE',
  MESSAGE = 'MESSAGE'
}
