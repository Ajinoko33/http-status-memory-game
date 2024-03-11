import { ConfigProvider } from 'antd';
import { ReactNode } from 'react';

export const AntDConfigProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Progress: {
            defaultColor: '#D9D9D9',
            remainingColor: '#52C41A',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
