import { Card, GameConfig, Selection, Status } from '@/types';
import { decideSelections } from '@/util';
import lodash from 'lodash';
import { useCallback, useRef, useState } from 'react';

export const maxStatusNums = 10;

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
  const cpuSelections = useRef<Selection[]>([]);
  const known = useRef<boolean[]>([]);

  /* internal function */
  const evalCard = useCallback(
    (index0: number, index1: number, curIsTurnA: boolean) => {
      if (index0 === index1) {
        return;
      }

      const paired = isPaired(index0, index1, fieldCards);
      if (paired) {
        setRemoved((r) => removeTwoCards(index0, index1, r));
        if (curIsTurnA) {
          setCounterA((ca) => ca + 2);
        } else {
          setCounterB((cb) => cb + 2);
        }
      } else {
        setOpened((o) => closeTwoCards(index0, index1, o));
        setIsTurnA(!curIsTurnA);
      }
      setFirstIndex(undefined);
    },
    [fieldCards],
  );

  const executeCpuSelection = useCallback(() => {
    const selection = cpuSelections.current.shift();
    if (selection === undefined) {
      return;
    }

    setTimeout(() => {
      setOpened((o) => openCard(selection.first, o));

      setTimeout(() => {
        setOpened((o) => openCard(selection.second, o));

        setTimeout(() => {
          evalCard(selection.first, selection.second, false);
          if (isPaired(selection.first, selection.second, fieldCards)) {
            executeCpuSelection();
          } else {
            setBlocked(false);
          }
        }, 1500);
      }, 1500);
    }, 1500);
  }, [evalCard, fieldCards]);

  const handleCpuTurn = useCallback(() => {
    // 裏返すカードをすべて決定
    cpuSelections.current = decideSelections(
      fieldCards,
      known.current,
      removed,
      config.cpuLevel,
    );
    cpuSelections.current.forEach(({ first, second }) => {
      known.current[first] = true;
      known.current[second] = true;
    });

    // 実行
    executeCpuSelection();
  }, [config, executeCpuSelection, fieldCards, removed]);

  /* export function */
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
    cpuSelections.current = [];
    known.current = Array(fieldCards.length).fill(false);
  }, [config.aIsFirst, config.statusSet.statuses]);

  const selectCard = useCallback(
    (index: number) => {
      if (blocked || opened[index] || removed[index]) return;
      setOpened((o) => openCard(index, o));
      known.current[index] = true;
      if (firstIndex === undefined) {
        setFirstIndex(index);
      } else {
        setBlocked(true);
        setTimeout(() => {
          evalCard(firstIndex, index, isTurnA);
          if (config.mode === 'PvE') {
            const paired = isPaired(firstIndex, index, fieldCards);
            if (paired) {
              setBlocked(false);
            } else {
              handleCpuTurn();
            }
          } else {
            setBlocked(false);
          }
        }, 1000);
      }
    },
    [
      blocked,
      config.mode,
      evalCard,
      fieldCards,
      firstIndex,
      handleCpuTurn,
      isTurnA,
      opened,
      removed,
    ],
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
