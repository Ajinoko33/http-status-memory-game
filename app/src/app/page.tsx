'use client';

import { useGameConfigContext } from '@/components';
import { PlayingMode } from '@/types';
import { Button, Flex } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function Home() {
  const router = useRouter();
  const { gameConfig, setGameConfig } = useGameConfigContext();

  const onClick = useCallback(
    (mode: PlayingMode) => {
      setGameConfig({ ...gameConfig, mode });
      router.replace(`/ready`);
    },
    [router, gameConfig, setGameConfig],
  );

  return (
    <Flex
      vertical
      align='center'
      justify='center'
      gap='32px'
      className='h-full max-h-[512px]'
    >
      <div className='text-[40px] font-bold text-center underline'>
        HTTPステータスコード
        <br />
        神経衰弱
      </div>
      <Flex vertical gap='middle'>
        <Button onClick={() => onClick('PvE')}>CPUと対戦</Button>
        <Button onClick={() => onClick('PvP')}>2人で対戦</Button>
        <Button onClick={() => onClick('training')}>トレーニング</Button>
      </Flex>
    </Flex>
  );
}
