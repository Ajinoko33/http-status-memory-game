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

export const getCpuName = (level: CpuLevel) => {
  switch (level) {
    case 'weak':
      return 'CPU(弱い)';
    case 'normal':
      return 'CPU(普通)';
    case 'strong':
      return 'CPU(強い)';
  }
};
