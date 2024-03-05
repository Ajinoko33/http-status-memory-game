import { StatusSetType } from '@/types';

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
