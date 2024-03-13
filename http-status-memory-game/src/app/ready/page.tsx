'use client';
import { useGameConfigContext } from '@/components';
import { getStatusSetName } from '@/util';
import { EditFilled, SwapOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { StatusSetSelectModal } from './_components/StatusSetSelectModal';

export default function ReadyPage() {
  const router = useRouter();
  const { gameConfig, setGameConfig } = useGameConfigContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onStart = useCallback(() => {
    router.replace('/game');
  }, [router]);
  const onBack = useCallback(() => {
    router.replace('/');
  }, [router]);

  const flipFirst = useCallback(() => {
    setGameConfig({ ...gameConfig, aIsFirst: !gameConfig.aIsFirst });
  }, [gameConfig, setGameConfig]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, [setIsModalOpen]);
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  return (
    <>
      <Flex
        vertical
        align='center'
        justify='center'
        gap='48px'
        className='h-full max-h-[512px]'
      >
        <div className='text-[40px] font-bold'>
          {gameConfig.mode === 'PvE'
            ? 'CPUと対戦'
            : gameConfig.mode === 'PvP'
              ? '2人で対戦'
              : 'トレーニング'}
        </div>
        <div className='flex flex-col items-center gap-8'>
          {gameConfig.mode !== 'training' && (
            <div className='grid grid-cols-7 gap-4'>
              <div className='col-span-3 text-center'>プレイヤーA</div>
              <div className='text-center'>
                <span className='text-base'>vs.</span>
              </div>
              <div className='col-span-3 text-center'>プレイヤーB</div>
              <div className='col-span-3 text-center'>
                {gameConfig.aIsFirst ? (
                  <span className='font-bold text-base'>先攻</span>
                ) : (
                  <span className='text-base'>後攻</span>
                )}
              </div>
              <div className='text-center'>
                <Button
                  shape='circle'
                  icon={<SwapOutlined />}
                  onClick={flipFirst}
                />
              </div>
              <div className='col-span-3 text-center'>
                {gameConfig.aIsFirst ? (
                  <span className='text-base'>後攻</span>
                ) : (
                  <span className='font-bold text-base'>先攻</span>
                )}
              </div>
            </div>
          )}
          <div className='col-span-7 text-center'>
            ステータスセット : {getStatusSetName(gameConfig.statusSet.type)}
            <span className='ml-1'>
              <Button
                shape='circle'
                icon={<EditFilled />}
                onClick={openModal}
                size='small'
              />
            </span>
          </div>
          <div className='flex flex-col gap-2'>
            <Button
              type='primary'
              htmlType='submit'
              style={{ width: '100px' }}
              onClick={onStart}
            >
              ゲーム開始
            </Button>
            <Button onClick={onBack} style={{ width: '100px' }}>
              戻る
            </Button>
          </div>
        </div>
      </Flex>

      <StatusSetSelectModal isOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
}
