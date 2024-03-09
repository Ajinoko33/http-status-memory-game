'use client';

import { Card as TCard } from '@/types';
import Image from 'next/image';
import { CSSProperties, FC } from 'react';

const svgWidth = 392;
const svgHeight = 512;
const ratio = 0.3;

export const cardWidth = svgWidth * ratio;
export const cardHeight = svgHeight * ratio;

export type CardProps = {
  item: TCard;
  onClick: () => void;
};

export const Card: FC<CardProps> = (props) => {
  const { item, onClick } = props;

  const frontStyle: CSSProperties = {
    borderWidth: '3px',
    borderColor: '#4B4B4B',
    borderRadius: '13.5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: item.type === 'code' ? 24 : 17,
  };

  return (
    <div className='card' onClick={onClick}>
      <input
        type='checkbox'
        role='button'
        title={`card_${item.id}`}
        hidden
        id={`card_check_${item.id}`}
        className='card_check'
        checked={item.opened}
        readOnly
      />
      <label
        htmlFor={`card_check_${item.id}`}
        aria-hidden='true'
        title={`card_${item.id}`}
      />
      <div className='front' style={frontStyle}>
        <span className={'font-bold'}>{item.status[item.type]}</span>
      </div>
      <Image
        alt='card'
        width={cardWidth}
        height={cardHeight}
        src='/images/card_back.svg'
        className='back'
      />
    </div>
  );
};
