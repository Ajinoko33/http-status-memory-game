'use client';

import { basicStatusSet } from '@/data';
import { GameConfig } from '@/types';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

const defaultGameConfig: GameConfig = {
  mode: 'PvP',
  players: {
    A: {
      name: 'プレイヤーA',
    },
    B: {
      name: 'プレイヤーB',
    },
  },
  aIsFirst: true,
  statusSet: basicStatusSet,
};

type GameConfigContext = {
  gameConfig: GameConfig;
  setGameConfig: Dispatch<SetStateAction<GameConfig>>;
};

export const GameConfigContext = createContext({} as GameConfigContext);

export const GameConfigContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [gameConfig, setGameConfig] = useState(defaultGameConfig);

  return (
    <GameConfigContext.Provider value={{ gameConfig, setGameConfig }}>
      {children}
    </GameConfigContext.Provider>
  );
};

export const useGameConfigContext = () => useContext(GameConfigContext);
