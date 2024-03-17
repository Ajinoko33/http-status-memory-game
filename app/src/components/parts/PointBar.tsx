import { Progress } from 'antd';
import { FC } from 'react';

export type PointBarProps = {
  total: number;
  left: number;
  right: number;
};

export const PointBar: FC<PointBarProps> = (props) => {
  const { total, left, right } = props;

  return (
    <Progress
      strokeLinecap='butt'
      success={{ percent: (100 * left) / total, strokeColor: '#1677FF' }}
      percent={(100 * (total - right)) / total}
      showInfo={false}
    />
  );
};
