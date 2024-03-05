'use client';

import { useGameConfigContext } from '@/components';

export default function ReadyPage() {
  const { gameConfig } = useGameConfigContext();

  return (
    <>
      <div>mode: {gameConfig.mode}</div>
      <div>playerAName: {gameConfig.playerAName}</div>
      <div>playerBName: {gameConfig.playerBName}</div>
      <div>playerBCpuLevel: {gameConfig.cpuLevel}</div>
      <div>first: {gameConfig.first}</div>
      <div>statusSetType: {gameConfig.statusSet.type}</div>
      <div>statusSet:</div>
      {gameConfig.statusSet.statuses.map((status) => {
        return <div>{`  ${status.code}: ${status.message}`}</div>;
      })}
    </>
  );
}
