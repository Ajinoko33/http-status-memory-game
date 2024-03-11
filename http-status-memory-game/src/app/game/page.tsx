'use client';

import {
  Field,
  PlayerPanel,
  PointBar,
  Result,
  useGameConfigContext,
} from '@/components';
import { useMemoryGame } from '@/hooks';
import { ResultType } from '@/types';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  useEffect(() => {
    build();
  }, [build]);

  const onClickCard = useCallback(
    (index: number) => {
      selectCard(index);
    },
    [selectCard],
  );

  const onRetry = useCallback(() => {
    build();
  }, [build]);
  const onBack = useCallback(() => {
    router.replace('/');
  }, [router]);

  const finished = counterA + counterB === fieldCards.length;
  const result: ResultType =
    counterA === counterB ? 'draw' : counterA > counterB ? 'A' : 'B';

  return (
    <>
      <div className='flex items-center justify-center min-h-[480px]'>
        {finished ? (
          <Result
            result={result}
            winnerName={
              result === 'A'
                ? gameConfig.players.A.name
                : gameConfig.players.B.name
            }
            onRetry={onRetry}
            onBack={onBack}
          />
        ) : (
          <Field
            cards={fieldCards}
            opened={opened}
            removed={removed}
            onClickCard={onClickCard}
          />
        )}
      </div>
      <div className='mt-6 flex items-center justify-center gap-4 text-[24px]'>
        <PlayerPanel
          player={gameConfig.players.A}
          point={counterA}
          isTurn={isTurnA}
        />
        <div className='w-[200px]'>
          <PointBar
            total={fieldCards.length}
            left={counterA}
            right={counterB}
          />
        </div>
        <PlayerPanel
          player={gameConfig.players.B}
          point={counterB}
          isTurn={!isTurnA}
        />
      </div>
    </>
  );
}
