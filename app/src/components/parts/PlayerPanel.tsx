import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import { CSSProperties, FC } from 'react';

export type PlayerPanelProps = {
  name: string;
  point: number;
  isTurn: boolean;
};

export const PlayerPanel: FC<PlayerPanelProps> = (props) => {
  const { name, point, isTurn } = props;

  const isTurnStyle: CSSProperties = {
    color: isTurn ? '#ff4d4f' : 'transparent',
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='flex gap-1'>
        <CaretRightOutlined style={isTurnStyle} />
        <div className='text-[17px]'>{name}</div>
        <CaretLeftOutlined style={isTurnStyle} />
      </div>
      <div className='text-[44px] font-bold'>{point}</div>
    </div>
  );
};
