'use client';

import { Layout as AntDLayout } from 'antd';
import { CSSProperties, ReactNode } from 'react';

const { Content } = AntDLayout;

const layoutStyle: CSSProperties = {
  backgroundColor: 'white',
  height: '100vh',
  width: '100vw',
};

const contentStyle: CSSProperties = {
  width: '900px',
  maxWidth: '100vw',
  margin: '0 auto',
};

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <AntDLayout style={layoutStyle}>
      <Content style={contentStyle}>{children}</Content>
    </AntDLayout>
  );
};
