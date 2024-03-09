import {
  allStatuses,
  basicStatuses,
  groupedStatuses,
  statusGroupNames,
  unbasicStatuses,
} from '@/data';
import { maxStatusNums } from '@/hooks';
import { Status, StatusGroup, StatusSet, StatusSetType } from '@/types';
import { getStatusSetName } from '@/util';
import {
  Button,
  Checkbox,
  Flex,
  Form,
  Modal,
  Radio,
  RadioChangeEvent,
  RadioGroupProps,
  Space,
  Table,
  TableProps,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';

const extractStatuses = (first: number, second: number) =>
  allStatuses.filter(
    (status) =>
      Math.floor(status.code / 100) === first &&
      Math.floor((status.code / 10) % 10) === second,
  );

type DataType = {
  key: string;
} & {
  [K in StatusGroup]: Status[];
};

const data: DataType[] = [0, 1, 2, 3, 5].map((value) => ({
  key: `${value}`,
  '1XX': extractStatuses(1, value),
  '2XX': extractStatuses(2, value),
  '3XX': extractStatuses(3, value),
  '4XX': extractStatuses(4, value),
  '5XX': extractStatuses(5, value),
}));

type FieldType = {
  [K in (typeof allStatuses)[number]['code']]: boolean;
} & {
  [K in StatusGroup]: boolean;
} & {
  type: StatusSetType;
};

const updateStatusGroupCheckbox = (
  groupName: StatusGroup,
  getFieldValue: (name: any) => any,
  setFieldValue: (name: any, value: any) => void,
) => {
  const groupIsAllChecked = groupedStatuses[groupName].every((status) =>
    getFieldValue(`${status.code}`),
  );
  setFieldValue(`${groupName}`, groupIsAllChecked);
};

const FormContent = () => {
  const form = Form.useFormInstance<FieldType>();

  const handleUpdateStatusGroupCheckbox = useCallback(
    (groupName: StatusGroup) => {
      updateStatusGroupCheckbox(
        groupName,
        form.getFieldValue,
        form.setFieldValue,
      );
    },
    [],
  );

  const renderCheckboxes = useCallback(
    (statuses: Status[]) => (
      <Flex vertical wrap='wrap' justify='right' className='max-h-[130px]'>
        {statuses.map((status) => (
          <Form.Item
            key={status.code}
            name={`${status.code}`}
            valuePropName='checked'
            noStyle
          >
            <Checkbox
              key={status.code}
              name={`${status.code}`}
              style={{ fontWeight: status.isBasic ? 'bold' : 'normal' }}
              onChange={(e) => {
                const statusGroupName =
                  `${Math.floor(status.code / 100).toString()}XX` as StatusGroup;
                handleUpdateStatusGroupCheckbox(statusGroupName);
                form.setFieldValue('type', 'custom');
              }}
            >
              {status.code}
            </Checkbox>
          </Form.Item>
        ))}
      </Flex>
    ),
    [],
  );

  const columns: TableProps<DataType>['columns'] = useMemo(
    () =>
      statusGroupNames.map((groupName) => ({
        title: (
          <Form.Item name={`${groupName}`} valuePropName='checked' noStyle>
            <Checkbox
              name={`${groupName}`}
              onChange={(e) => {
                groupedStatuses[groupName].forEach((status) => {
                  form.setFieldValue(`${status.code}`, e.target.checked);
                });
                form.setFieldValue('type', 'custom');
              }}
            >
              {groupName}
            </Checkbox>
          </Form.Item>
        ),
        dataIndex: groupName,
        render: renderCheckboxes,
        className: 'align-top',
      })),
    [],
  );

  const checkCheckBoxesOnly = useCallback((statuses: Status[]) => {
    allStatuses.forEach((status) => {
      form.setFieldValue(`${status.code}`, false);
    });
    statuses.forEach((status) => {
      form.setFieldValue(`${status.code}`, true);
    });
    statusGroupNames.forEach((groupName) => {
      handleUpdateStatusGroupCheckbox(groupName);
    });
  }, []);
  const onChangeStatusSet: RadioGroupProps['onChange'] = useCallback(
    (e: RadioChangeEvent) => {
      const value: StatusSetType = e.target.value;
      switch (value) {
        case 'basic':
          checkCheckBoxesOnly(basicStatuses);
          break;
        case 'unbasic':
          checkCheckBoxesOnly(unbasicStatuses);
          break;
      }
    },
    [checkCheckBoxesOnly],
  );

  return (
    <>
      <Form.Item name='type'>
        <Radio.Group name='type' onChange={onChangeStatusSet}>
          <Space direction='vertical'>
            <Radio value='basic' style={{ fontWeight: 'bold' }}>
              {getStatusSetName('basic')}
            </Radio>
            <Radio value='unbasic'>{getStatusSetName('unbasic')}</Radio>
            <Radio value='custom'>{getStatusSetName('custom')}</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>
      <Form.Item>
        <Table columns={columns} dataSource={data} pagination={false} />
      </Form.Item>
      <Form.Item>
        <div className='text-center'>
          {`${maxStatusNums}種類より多く選択した場合は、その中からランダムに${maxStatusNums}種類が選ばれます。`}
        </div>
      </Form.Item>
    </>
  );
};

export type StatusSetSelectModalProps = {
  statusSet: StatusSet;
  setStatusSet: (statusSet: StatusSet) => void;
  isOpen: boolean;
  closeModal: () => void;
};

export const StatusSetSelectModal: FC<StatusSetSelectModalProps> = (props) => {
  const { statusSet, setStatusSet, isOpen, closeModal } = props;
  const [form] = useForm<FieldType>();
  const [isEmptyStatusSet, setIsEmptyStatusSet] = useState(false);

  const handleUpdateStatusGroupCheckbox = useCallback(
    (groupName: StatusGroup) => {
      updateStatusGroupCheckbox(
        groupName,
        form.getFieldValue,
        form.setFieldValue,
      );
    },
    [],
  );

  // open時にformに初期値を設定
  useEffect(() => {
    if (isOpen) {
      form.setFieldValue('type', statusSet.type);
      allStatuses.forEach((status) => {
        form.setFieldValue(`${status.code}`, false);
      });
      statusSet.statuses.forEach((status) => {
        form.setFieldValue(`${status.code}`, true);
      });
      statusGroupNames.forEach((name) => handleUpdateStatusGroupCheckbox(name));
    }
  }, [isOpen]);

  // OK時にstatusSetにformの値を設定
  const onOk = useCallback(() => {
    const type = form.getFieldValue('type');
    const statuses = allStatuses.filter((status) =>
      form.getFieldValue(`${status.code}`),
    );
    if (statuses.length === 0) {
      setIsEmptyStatusSet(true);
      return;
    }
    setStatusSet({ type, statuses });
    setIsEmptyStatusSet(false);
    closeModal();
  }, [form, setStatusSet, closeModal, setIsEmptyStatusSet]);

  const onCancel = useCallback(() => {
    setIsEmptyStatusSet(false);
    closeModal();
  }, [setIsEmptyStatusSet, closeModal]);

  return (
    <Modal
      title='ステータスセット'
      open={isOpen}
      footer={null}
      style={{ top: 24 }}
      onCancel={closeModal}
      maskClosable={false}
      width={800}
    >
      <Form form={form}>
        <FormContent />
        {isEmptyStatusSet && (
          <Form.Item>
            <div className='font-bold text-red-500 text-center'>
              1種類以上のステータスを選択してください。
            </div>
          </Form.Item>
        )}
        <Form.Item className='text-right !mb-0'>
          <Space>
            <Button onClick={onCancel}>キャンセル</Button>
            <Button type='primary' htmlType='submit' onClick={onOk}>
              OK
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
