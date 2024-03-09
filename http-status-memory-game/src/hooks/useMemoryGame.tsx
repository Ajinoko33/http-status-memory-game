import { Card, GameConfig, Status } from '@/types';
import lodash from 'lodash';
import { useCallback, useState } from 'react';

export const maxStatusNums = 15;

const makeFieldCards = (statuses: Status[]) => {
  const extractedStatuses = lodash.shuffle(statuses).slice(0, maxStatusNums);
  const codeCards = extractedStatuses.map(
    (status, index) =>
      ({
        id: index,
        type: 'code',
        status: status,
      }) as Card,
  );
  const messaageCards = extractedStatuses.map(
    (status, index) =>
      ({
        id: index + extractedStatuses.length,
        type: 'message',
        status: status,
      }) as Card,
  );
  return [...codeCards, ...messaageCards];
};

const openCard = (index: number, opened: boolean[]) =>
  opened.toSpliced(index, 1, true);
const closeTwoCards = (index0: number, index1: number, opened: boolean[]) =>
  opened.toSpliced(index0, 1, false).toSpliced(index1, 1, false);
const removeTwoCards = (index0: number, index1: number, removed: boolean[]) =>
  removed.toSpliced(index0, 1, true).toSpliced(index1, 1, true);

const isPaired = (
  firstIndex: number,
  secondIndex: number,
  fieldCards: Card[],
) => {
  const firstCard = fieldCards[firstIndex];
  const secondCard = fieldCards[secondIndex];
  return (
    firstCard.type !== secondCard.type &&
    firstCard.status.code === secondCard.status.code
  );
};

export const useMemoryGame = (config: GameConfig) => {
  const [fieldCards, setFieldCards] = useState<Card[]>([]);
  const [counterA, setCounterA] = useState(0);
  const [counterB, setCounterB] = useState(0);
  const [isTurnA, setIsTurnA] = useState(config.aIsFirst);
  const [firstIndex, setFirstIndex] = useState<number | undefined>(undefined);
  const [opened, setOpened] = useState<boolean[]>([]);
  const [removed, setRemoved] = useState<boolean[]>([]);
  const [blocked, setBlocked] = useState<boolean>(false);

  const build = useCallback(() => {
    const fieldCards = lodash.shuffle(
      makeFieldCards(config.statusSet.statuses),
    );
    setFieldCards(fieldCards);
    setCounterA(0);
    setCounterB(0);
    setIsTurnA(config.aIsFirst);
    setFirstIndex(undefined);
    setOpened(Array(fieldCards.length).fill(false));
    setRemoved(Array(fieldCards.length).fill(false));
    setBlocked(false);
  }, [config.aIsFirst, config.statusSet.statuses]);

  const evalCard = useCallback(
    (index0: number, index1: number) => {
      if (index0 === index1) {
        return;
      }

      const paired = isPaired(index0, index1, fieldCards);
      if (paired) {
        setRemoved((r) => removeTwoCards(index0, index1, r));
        if (isTurnA) {
          setCounterA(counterA + 2);
        } else {
          setCounterB(counterB + 2);
        }
      } else {
        setOpened((o) => closeTwoCards(index0, index1, o));
        setIsTurnA(!isTurnA);
      }
      setFirstIndex(undefined);
    },
    [counterA, counterB, fieldCards, isTurnA],
  );

  const selectCard = useCallback(
    (index: number) => {
      if (blocked || opened[index] || removed[index]) return;
      setOpened((o) => openCard(index, o));
      if (firstIndex === undefined) {
        setFirstIndex(index);
      } else {
        setBlocked(true);
        setTimeout(() => {
          evalCard(firstIndex, index);
          setBlocked(false);
        }, 1000);
      }
    },
    [blocked, evalCard, firstIndex, opened, removed],
  );

  return [
    fieldCards,
    counterA,
    counterB,
    isTurnA,
    opened,
    removed,
    build,
    selectCard,
  ] as const;
};
