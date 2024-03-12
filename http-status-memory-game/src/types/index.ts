export type PlayingMode = 'PvE' | 'PvP' | 'training';

export type CpuLevel = 'weak' | 'normal' | 'strong';

export type Status = {
  code: number;
  message: string;
  isBasic: boolean;
};

export type StatusSetType = 'basic' | 'unbasic' | 'custom';
export type StatusSet = {
  type: StatusSetType;
  statuses: Status[];
};

export type StatusGroup = '1XX' | '2XX' | '3XX' | '4XX' | '5XX';

export type GameConfig = {
  mode: PlayingMode;
  cpuLevel?: CpuLevel;
  aIsFirst: boolean;
  statusSet: StatusSet;
};

export type CardType = 'code' | 'message';
export type Card = {
  id: number;
  type: CardType;
  status: Status;
};

export type ResultType = 'A' | 'B' | 'draw';
