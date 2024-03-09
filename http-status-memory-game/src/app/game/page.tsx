'use client';

import {
  Card,
  cardHeight,
  cardWidth,
  useGameConfigContext,
} from '@/components';
import { useMemoryGame } from '@/hooks';
import { Space } from 'antd';
import { useEffect } from 'react';

export default function ReadyPage() {
  const { gameConfig } = useGameConfigContext();
  const [fieldCards, counterA, counterB, isTurnA, build, selectCard] =
    useMemoryGame(gameConfig);

  useEffect(() => {
    build();
  }, []);

  console.log(fieldCards);

  return (
    <>
      <Space wrap>
        {fieldCards.map((card, index) =>
          card.removed ? (
            <div
              key={card.id}
              style={{ width: cardWidth, height: cardHeight }}
            />
          ) : (
            <Card key={card.id} item={card} onClick={() => selectCard(index)} />
          ),
        )}
      </Space>
    </>
  );
}
