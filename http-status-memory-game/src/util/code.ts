import { CpuLevel, StatusSetType } from '@/types';

export const getStatusSetName = (type: StatusSetType) => {
  switch (type) {
    case 'basic':
      return 'ベーシック';
    case 'unbasic':
      return '非ベーシック';
    case 'custom':
      return 'カスタム';
  }
};

export const getCpuLabel = (level: CpuLevel) => {
  switch (level) {
    case 'weak':
      return '弱い';
    case 'normal':
      return '普通';
    case 'strong':
      return '強い';
  }
};
