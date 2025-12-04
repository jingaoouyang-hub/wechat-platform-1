import dayjs from 'dayjs';

export interface IQueryDataType {
  current?: string;
  dictCode?: string;
  dictName?: string;
  dictStatus?: number | string;
  gmtCreateEnd?: string;
  gmtCreateStart?: string;
  time?: dayjs[];
}

export interface ITableDataType {
  dictCode?: string;
  dictName?: string;
  dictStatus?: number | string;
  dictStatusBoolean?: boolean;
  remark?: string;
  id?: string;
  gmtCreate?: string;
}

export interface ITableChildDataType {
  createdBy?: string;
  dictCode?: string;
  gmtCreate?: string;
  gmtModified?: string;
  id?: string;
  itemCode?: string;
  itemName?: string;
  itemSort?: number;
  itemStatus?: number | string;
  itemStatusBoolean?: boolean;
  itemStyle?: unknown;
  remark?: string;
  updateBy?: string;
}

export interface IStatusType {
  label: string;
  value: number | string;
}
