import { ResultType } from '@/types';
import {
  CheckCircleFilled,
  DashOutlined,
  TrophyTwoTone,
} from '@ant-design/icons';
import { Result as AntDResult, Button } from 'antd';
import { FC } from 'react';

export type ResultProps = {
  result: ResultType;
  winnerName?: string;
  onRetry: () => void;
  onBack: () => void;
};

export const Result: FC<ResultProps> = (props) => {
  const { result, winnerName, onRetry, onBack } = props;

  return (
    <AntDResult
      icon={
        result === 'clear' ? (
          <CheckCircleFilled style={{ color: '#52C41A' }} />
        ) : result === 'draw' ? (
          <DashOutlined />
        ) : (
          <TrophyTwoTone twoToneColor='#faad14' />
        )
      }
      title={
        result === 'clear' ? (
          'クリア！'
        ) : result === 'draw' ? (
          '引き分け'
        ) : (
          <>
            <span className='font-bold'>{winnerName}</span>
            {` の勝利！`}
          </>
        )
      }
      extra={
        <div className='flex justify-center'>
          <div className='flex flex-col gap-2'>
            <Button type='primary' onClick={onRetry}>
              {result === 'draw' ? '決着をつける' : 'もう一度'}
            </Button>
            <Button onClick={onBack}>TOPに戻る</Button>
          </div>
        </div>
      }
    />
  );
};
