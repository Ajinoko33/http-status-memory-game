'use client';
import { useGameConfigContext } from '@/components';
import { getStatusSetName } from '@/util';
import { EditFilled, SwapOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Row } from 'antd';
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
        <div className='text-[40px] font-bold'>2人で対戦</div>
        <Flex vertical gap='32px'>
          <Row gutter={[0, 24]}>
            <Col span={2}></Col>
            <Col span={9}>
              <div className='text-center'>プレイヤーA</div>
            </Col>
            <Col span={2} className='text-center m-auto'>
              <span className='text-base'>vs.</span>
            </Col>
            <Col span={9}>
              <div className='text-center'>プレイヤーB</div>
            </Col>
            <Col span={2}></Col>

            <Col span={2}></Col>
            <Col span={9} className='text-center m-auto text-base'>
              {gameConfig.aIsFirst ? (
                <span className='font-bold text-base'>先攻</span>
              ) : (
                <span className='text-base'>後攻</span>
              )}
            </Col>
            <Col span={2} className='text-center m-auto'>
              <Button
                shape='circle'
                icon={<SwapOutlined />}
                onClick={flipFirst}
              />
            </Col>
            <Col span={9} className='text-center m-auto'>
              {gameConfig.aIsFirst ? (
                <span className='text-base'>後攻</span>
              ) : (
                <span className='font-bold text-base'>先攻</span>
              )}
            </Col>
            <Col span={2}></Col>

            <Col span={24} className='text-center'>
              <div>
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
            </Col>
          </Row>
          <Flex vertical align='center' gap='8px'>
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
          </Flex>
        </Flex>
      </Flex>

      <StatusSetSelectModal isOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
}
