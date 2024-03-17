import { Card as TCard } from '@/types';
import { Flex } from 'antd';
import { FC } from 'react';
import { Card, cardHeight, cardWidth } from '.';

export type FieldProps = {
  cards: TCard[];
  opened: boolean[];
  removed: boolean[];
  onClickCard: (index: number) => void;
};

export const Field: FC<FieldProps> = (props) => {
  const { cards, opened, removed, onClickCard } = props;

  return (
    <>
      <div
        style={{
          maxWidth:
            cards.length < 14
              ? `${900 - (7 - cards.length / 2) * cardWidth}px`
              : '100%',
        }}
      >
        <Flex wrap='wrap' justify='center' gap='small'>
          {cards.map((card, index) => (
            <div key={card.id}>
              {removed[index] ? (
                <div style={{ width: cardWidth, height: cardHeight }} />
              ) : (
                <Card
                  item={card}
                  opened={opened[index]}
                  onClick={() => onClickCard(index)}
                />
              )}
            </div>
          ))}
        </Flex>
      </div>
    </>
  );
};
