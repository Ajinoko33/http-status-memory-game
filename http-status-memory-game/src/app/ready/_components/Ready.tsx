import { useGameConfigContext } from '@/components';
import { basicStatusSet } from '@/data';
import { GameConfig } from '@/types';
import { getStatusSetName } from '@/util';
import { EditFilled, SwapOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Form, Input, Row } from 'antd';
import { useRouter } from 'next/navigation';
import { CSSProperties, useCallback, useState } from 'react';
import { StatusSetSelectModal } from './StatusSetSelectModal';

const inputStyle: CSSProperties = {
  width: '160px',
  display: 'block',
  margin: '0 auto',
  textAlign: 'center',
};

type FieldType = {
  playerAName: GameConfig['players']['A']['name'];
  playerBName: GameConfig['players']['B']['name'];
};

export const Ready = () => {
  const router = useRouter();
  const { gameConfig, setGameConfig } = useGameConfigContext();
  const [aIsFirst, setAIsFirst] = useState(true);
  const [selectedStatusSet, setSelectedStatusSet] = useState(basicStatusSet);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onFinish = useCallback(
    (values: FieldType) => {
      const newGameConfig: GameConfig = {
        ...gameConfig,
        players: {
          A: {
            name: values.playerAName,
          },
          B: {
            name: values.playerBName,
          },
        },
        aIsFirst: aIsFirst,
        statusSet: selectedStatusSet,
      };
      setGameConfig(newGameConfig);
      router.replace('/game');
    },
    [router, gameConfig, aIsFirst, selectedStatusSet, setGameConfig],
  );

  const onBack = useCallback(() => {
    router.replace('/');
  }, [router]);

  const flipFirst = useCallback(() => {
    setAIsFirst(!aIsFirst);
  }, [aIsFirst, setAIsFirst]);

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
        <Form
          onFinish={onFinish}
          className='w-[512px] max-w-full'
          initialValues={{
            playerAName: gameConfig.players.A.name,
            playerBName: gameConfig.players.B.name,
          }}
        >
          <Flex vertical gap='32px'>
            <Row gutter={[0, 24]}>
              <Col span={2}></Col>
              <Col span={9}>
                <Form.Item<FieldType>
                  name='playerAName'
                  style={{ marginBottom: 0 }}
                >
                  <Input placeholder='プレイヤーA' style={inputStyle} />
                </Form.Item>
              </Col>
              <Col span={2} className='text-center m-auto'>
                <span className='text-base'>vs.</span>
              </Col>
              <Col span={9}>
                <Form.Item<FieldType>
                  name='playerBName'
                  style={{ marginBottom: 0 }}
                >
                  <Input placeholder='プレイヤーB' style={inputStyle} />
                </Form.Item>
              </Col>
              <Col span={2}></Col>

              <Col span={2}></Col>
              <Col span={9} className='text-center m-auto text-base'>
                {aIsFirst ? (
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
                {aIsFirst ? (
                  <span className='text-base'>後攻</span>
                ) : (
                  <span className='font-bold text-base'>先攻</span>
                )}
              </Col>
              <Col span={2}></Col>

              <Col span={24} className='text-center'>
                <div>
                  ステータスセット : {getStatusSetName(selectedStatusSet.type)}
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
              >
                ゲーム開始
              </Button>
              <Button onClick={onBack} style={{ width: '100px' }}>
                戻る
              </Button>
            </Flex>
          </Flex>
        </Form>
      </Flex>

      <StatusSetSelectModal
        statusSet={selectedStatusSet}
        setStatusSet={setSelectedStatusSet}
        isOpen={isModalOpen}
        closeModal={closeModal}
      />
    </>
  );
};
