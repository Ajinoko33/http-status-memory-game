'use client';

import {
  Card,
  cardHeight,
  cardWidth,
  useGameConfigContext,
} from '@/components';
import { useMemoryGame } from '@/hooks';
import { Space } from 'antd';
import { useCallback, useEffect } from 'react';

export default function ReadyPage() {
  const { gameConfig } = useGameConfigContext();
  const [
    fieldCards,
    counterA,
    counterB,
    isTurnA,
    opened,
    removed,
    build,
    selectCard,
  ] = useMemoryGame(gameConfig);

  useEffect(() => {
    build();
  }, [build]);

  const onClickCard = useCallback(
    (index: number) => {
      selectCard(index);
    },
    [selectCard],
  );

  return (
    <>
      <Space wrap>
        {fieldCards.map((card, index) =>
          removed[index] ? (
            <div
              key={card.id}
              style={{ width: cardWidth, height: cardHeight }}
            />
          ) : (
            <Card
              key={card.id}
              item={card}
              opened={opened[index]}
              onClick={() => onClickCard(index)}
            />
          ),
        )}
      </Space>
      <div className='mt-6 flex items-center justify-center gap-4 text-[24px]'>
        <div style={isTurnA ? { borderWidth: '2px', borderColor: 'red' } : {}}>
          {counterA}
        </div>
        <div style={!isTurnA ? { borderWidth: '2px', borderColor: 'red' } : {}}>
          {counterB}
        </div>
      </div>
    </>
  );
}
