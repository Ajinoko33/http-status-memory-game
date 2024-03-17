'use client';
import { useGameConfigContext } from '@/components';
import { getCpuLabel, getStatusSetName } from '@/util';
import { EditFilled, SwapOutlined } from '@ant-design/icons';
import { Button, Flex, Radio, RadioChangeEvent } from 'antd';
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
  const onChangeCpuLevel = useCallback(
    (e: RadioChangeEvent) => {
      setGameConfig({ ...gameConfig, cpuLevel: e.target.value });
    },
    [gameConfig, setGameConfig],
  );

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
        <div className='flex flex-col items-center gap-8 text-base'>
          {gameConfig.mode !== 'training' && (
            <div className='grid grid-cols-7 gap-3'>
              <div className='col-span-3 flex items-center justify-center text-center'>
                プレイヤーA
              </div>
              <div className='text-center'>vs.</div>
              <div className='col-span-3 flex items-center justify-center text-center'>
                {gameConfig.mode === 'PvE'
                  ? `CPU(${getCpuLabel(gameConfig.cpuLevel)})`
                  : 'プレイヤーB'}
              </div>
              <div className='col-span-3 flex items-center justify-center text-center'>
                {gameConfig.aIsFirst ? (
                  <span className='font-bold'>先攻</span>
                ) : (
                  '後攻'
                )}
              </div>
              <div className='text-center'>
                <Button
                  shape='circle'
                  icon={<SwapOutlined />}
                  onClick={flipFirst}
                />
              </div>
              <div className='col-span-3 flex items-center justify-center text-center'>
                {gameConfig.aIsFirst ? (
                  '後攻'
                ) : (
                  <span className='font-bold'>先攻</span>
                )}
              </div>
            </div>
          )}
          <div className='grid grid-cols-2 gap-3'>
            <div className='text-right'>ステータスセット :</div>
            <div>
              {getStatusSetName(gameConfig.statusSet.type)}
              <span className='ml-1'>
                <Button
                  shape='circle'
                  icon={<EditFilled />}
                  onClick={openModal}
                  size='small'
                />
              </span>
            </div>
            {gameConfig.mode === 'PvE' && (
              <>
                <div className='text-right'>CPUの強さ :</div>
                <div>
                  <Radio.Group
                    onChange={onChangeCpuLevel}
                    value={gameConfig.cpuLevel}
                  >
                    <Radio value='weak'>{getCpuLabel('weak')}</Radio>
                    <Radio value='normal'>{getCpuLabel('normal')}</Radio>
                    <Radio value='strong'>{getCpuLabel('strong')}</Radio>
                  </Radio.Group>
                </div>
              </>
            )}
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
