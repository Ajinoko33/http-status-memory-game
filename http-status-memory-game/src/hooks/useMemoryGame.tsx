import { Card, GameConfig, Status } from '@/types';
import lodash from 'lodash';
import { useCallback, useEffect, useState } from 'react';

export const maxStatusNums = 15;

const makeCards = (statuses: Status[]) => {
  const extractedStatuses = lodash.shuffle(statuses).slice(0, maxStatusNums);
  const codeCards = extractedStatuses.map(
    (status, index) =>
      ({
        id: index,
        type: 'code',
        status: status,
        opened: false,
        removed: false,
      }) as Card,
  );
  const messaageCards = extractedStatuses.map(
    (status, index) =>
      ({
        id: index + extractedStatuses.length,
        type: 'message',
        status: status,
        opened: false,
        removed: false,
      }) as Card,
  );
  return [...codeCards, ...messaageCards];
};

const changeOpened = (index: number, opened: boolean, fieldCards: Card[]) => {
  const newCard = { ...fieldCards[index], opened } as Card;
  const newFieldCards = fieldCards.toSpliced(index, 1, newCard);
  return newFieldCards;
};
const openCard = (index: number, fieldCards: Card[]) =>
  changeOpened(index, true, fieldCards);
const closeCard = (index: number, fieldCards: Card[]) =>
  changeOpened(index, false, fieldCards);

const removeCard = (index: number, fieldCards: Card[]) => {
  const newCard = { ...fieldCards[index], removed: true } as Card;
  const newFieldCards = fieldCards.toSpliced(index, 1, newCard);
  return newFieldCards;
};

const countUp = (counter: number) => counter + 2;

const changeTurn = (isTurnA: boolean) => !isTurnA;

export const useMemoryGame = (config: GameConfig) => {
  const [fieldCards, setFieldCards] = useState<Card[]>([]);
  const [counterA, setCounterA] = useState(0);
  const [counterB, setCounterB] = useState(0);
  const [isTurnA, setIsTurnA] = useState(config.aIsFirst);
  const [firstIndex, setFirstIndex] = useState<number | undefined>(undefined);
  const [isSleep, setIsSleep] = useState(false);
  const [pairedIndexs, setPairedIndexs] = useState<
    [number, number] | undefined
  >(undefined);

  useEffect(() => {
    if (pairedIndexs) {
      setTimeout(() => {
        setFieldCards((fc) => removeCard(pairedIndexs[0], fc));
        setFieldCards((fc) => removeCard(pairedIndexs[1], fc));
        setIsSleep(false);
      }, 1000);
      setPairedIndexs(undefined);
    }
  }, [pairedIndexs]);

  const build = useCallback(() => {
    setFieldCards(lodash.shuffle(makeCards(config.statusSet.statuses)));
    setCounterA(0);
    setCounterB(0);
    setIsTurnA(config.aIsFirst);
    setFirstIndex(undefined);
  }, [
    config,
    setFieldCards,
    setCounterA,
    setCounterB,
    setIsTurnA,
    setFirstIndex,
  ]);

  const selectCard = useCallback(
    (index: number) => {
      if (isSleep) return;
      if (index === firstIndex) return;

      const selectedCard = fieldCards[index];
      if (selectedCard.removed) return;

      setFieldCards((fc) => openCard(index, fc));

      if (firstIndex === undefined) {
        // 1枚目の場合
        setFirstIndex(index);
        return;
      }

      // 2枚目の場合
      const firstCard = fieldCards[firstIndex];

      const isPair =
        selectedCard.type !== firstCard.type &&
        selectedCard.status.code === firstCard.status.code;
      if (isPair) {
        if (isTurnA) setCounterA((ca) => countUp(ca));
        else setCounterB((cb) => countUp(cb));

        setPairedIndexs([firstIndex, index]);
      } else {
        setIsTurnA((ita) => changeTurn(ita));
      }
      setFirstIndex(undefined);

      setIsSleep(true);
      setTimeout(() => {
        setFieldCards((fc) => closeCard(index, fc));
        setFieldCards((fc) => closeCard(firstIndex, fc));
        setIsSleep(false);
      }, 1000);
    },
    [
      fieldCards,
      setFieldCards,
      setCounterA,
      setCounterB,
      isTurnA,
      setIsTurnA,
      firstIndex,
      setFirstIndex,
      isSleep,
      setIsSleep,
    ],
  );

  return [fieldCards, counterA, counterB, isTurnA, build, selectCard] as const;
};
