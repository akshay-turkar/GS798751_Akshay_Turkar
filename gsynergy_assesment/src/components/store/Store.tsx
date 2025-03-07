import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import sampleData from '../../assets/sample-data.xlsx'; 
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';

interface DataType {
  key: React.Key;
  Sno: string;
  Label: string;
  City: string;
  State: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'S.No',
    dataIndex: 'Sno',
    filterSearch: true,
    onFilter: (value, record) => record.Sno.startsWith(value as string),
    width: '10%',
  },
  {
    title: 'Store',
    dataIndex: 'Label',
    filters: [
      {
        text: 'Joe',
        value: 'Joe',
      },
      {
        text: 'Category 1',
        value: 'Category 1',
      },
      {
        text: 'Category 2',
        value: 'Category 2',
      },
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.Label.startsWith(value as string),
    width: '30%',
  },
  {
    title: 'City',
    dataIndex: 'City',
    onFilter: (value, record) => record.City.startsWith(value as string),
  },
  {
    title: 'State',
    dataIndex: 'State',
    onFilter: (value, record) => record.State.startsWith(value as string),
    filterSearch: true,
    width: '40%',
  },
];

const Store = () => {
  const [data, setData] = useState<DataType[]>([]);

  // Read the "stores" sheet from the sample-data.xlsx file
  const readStoresSheet = () => {
    fetch(sampleData)
      .then(response => response.arrayBuffer())
      .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = 'Stores';
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<DataType>(worksheet);
        const dataArray = jsonData.map((item, index) => ({ ...item,  key: index }));
        setData(dataArray);
      });
  };

  useEffect(() => {
    readStoresSheet();
  }, []);

  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <div>
      <Table<DataType> columns={columns} dataSource={data} onChange={onChange} />
    </div>
  );
};

export default Store;