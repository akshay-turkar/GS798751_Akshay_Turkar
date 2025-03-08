import React, { useState, useEffect } from 'react';
import '../../common-style.css';
import './Planning.css';
import * as XLSX from 'xlsx';
import sampleData from '../../assets/sample-data.xlsx'; 
import { Table, Tooltip } from 'antd';
import type { TableColumnsType } from 'antd';

interface DataType {
  key: React.Key;
  Store: string;
  SKU: string;
  Week: string;
  SalesUnits: number;
  SalesDollars: string;
  GMDollars: string;
  GMPercent: string;
}
interface PlanningDataType {
  key: React.Key;
  Store: string;
  SKU: string;
  Week: string;
  SalesUnits: number;
}
interface StoreDataType {
  key: React.Key;
  ID: string;
  Sno: string;
  Label: string;
  City: string;
  State: string;
}

interface SkuDataType {
  key: React.Key;
  ID: string;
  Label: string;
  Price: number;
  Cost: number;
}

const Planning = () => {
  const [planningData, setPlanningData] = useState<PlanningDataType[]>([]);
  const [SkuData, setSkuData] = useState<SkuDataType[]>([]);
  const [StoreData, setStoreData] = useState<StoreDataType[]>([]);
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  const getGMPercentColor = (percent: number) => {
    if (percent >= 40) return '#469f4d';
    if (percent >= 10) return '#fbb524';
    if (percent > 5) return '#fb923c';
    return '#fba3a3';
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Store',
      dataIndex: 'Store',
      key: 'Store',
    },
    {
      title: 'SKU',
      dataIndex: 'SKU',
      key: 'SKU',
    },
    ...Array.from(new Set(planningData.map(item => item.Week))).map(week => ({
      title: `${week.toString().padStart(2, '0')}`,
      children: [
        {
          title: 'Sales Unit',
          dataIndex: `W${week.toString().padStart(2, '0')}`,
          key: `W${week.toString().padStart(2, '0')}-SalesUnits`,
          sorter: (a: any, b: any) => a[`W${week.toString().padStart(2, '0')}`]?.SalesUnits - b[`W${week.toString().padStart(2, '0')}`]?.SalesUnits,
          render: (_: any, record: any) => record[`W${week.toString().padStart(2, '0')}`]?.SalesUnits || 0,
        },
        {
          title: 'Sales Dollars',
          dataIndex: `W${week.toString().padStart(2, '0')}`,
          key: `W${week.toString().padStart(2, '0')}-SalesDollars`,
          render: (_: any, record: any) => record[`W${week.toString().padStart(2, '0')}`]?.SalesDollars || '0.00',
        },
        {
          title: 'GM Dollars',
          dataIndex: `W${week.toString().padStart(2, '0')}`,
          key: `W${week.toString().padStart(2, '0')}-GMDollars`,
          render: (_: any, record: any) => record[`W${week.toString().padStart(2, '0')}`]?.GMDollars || '0.00',
        },
        {
          title: 'GM Percent',
          dataIndex: `W${week.toString().padStart(2, '0')}`,
          key: `W${week.toString().padStart(2, '0')}-GMPercent`,
          render: (_: any, record: any) => {
            const percent = parseFloat(record[`W${week.toString().padStart(2, '0')}`]?.GMPercent) || 0;
            const color = getGMPercentColor(percent);
            return (
              <div style={{ backgroundColor: color, padding: '5px' }}>
                {record[`W${week.toString().padStart(2, '0')}`]?.GMPercent || '0.00'}
              </div>
            );
          },
        },
      ],
    })),
  ];

const readPlanningSheet = async () => {
  try {
    const response = await fetch(sampleData);
    const data = await response.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = 'Planning';
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<PlanningDataType>(worksheet);
    return jsonData.map((item, index) => ({ ...item, key: index }));
  } catch (error) {
    console.error('Error reading Planning sheet:', error);
    return [];
  }
};

const readStoresSheet = async () => {
  try {
    const response = await fetch(sampleData);
    const data = await response.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = 'Stores';
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<StoreDataType>(worksheet);
    return jsonData.map((item, index) => ({ ...item, key: index }));
  } catch (error) {
    console.error('Error reading Stores sheet:', error);
    return [];
  }
};

const readSkusSheet = async () => {
  try {
    const response = await fetch(sampleData);
    const data = await response.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = 'SKUs';
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<SkuDataType>(worksheet);
    return jsonData.map((item, index) => ({ ...item, key: index }));
  } catch (error) {
    console.error('Error reading SKUs sheet:', error);
    return [];
  }
};

const prepareData = () => {
  const weeks = Array.from(new Set(planningData.map(item => item.Week)));
  const groupedData = planningData.reduce((acc: { [key: string]: any }, item) => {
    const store = StoreData.find(store => store.ID === item.Store);
    const sku = SkuData.find(sku => sku.ID === item.SKU);
    const SalesUnits = item.SalesUnits || 0;
    const SalesDollars = SalesUnits * (sku?.Price || 0);
    const GMDollars = SalesUnits * (sku?.Cost || 0);
    const GMPercent = SalesDollars ? (GMDollars / SalesDollars) * 100 : 0;

    const key = `${store?.Label}-${sku?.Label}`;
    if (!acc[key]) {
      acc[key] = {
        key,
        Store: store?.Label || 'Unknown Store',
        SKU: sku?.Label || 'Unknown SKU',
        Weeks: {},
      };
    }
    acc[key].Weeks[`W${item.Week.toString().padStart(2, '0')}`] = {
      SalesUnits,
      SalesDollars: SalesDollars.toFixed(2),
      GMDollars: GMDollars.toFixed(2),
      GMPercent: GMPercent.toFixed(2),
    };
    return acc;
  }, {});

  const preparedData = Object.values(groupedData).map((item: any) => {
    weeks.forEach(week => {
      const weekKey = `W${week.toString().padStart(2, '0')}`;
      if (!item.Weeks[weekKey]) {
        item.Weeks[weekKey] = {
          SalesUnits: 0,
          SalesDollars: '0.00',
          GMDollars: '0.00',
          GMPercent: '0.00',
        };
      }
    });
    return {
      key: item.key,
      Store: item.Store,
      SKU: item.SKU,
      ...item.Weeks,
    };
  });
  setData(preparedData);
};

useEffect(() => {
}, [data]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [planningDataArray, storeDataArray, skuDataArray] = await Promise.all([readPlanningSheet(), readStoresSheet(), readSkusSheet()]);
      
      setPlanningData(planningDataArray);
      setStoreData(storeDataArray);
      setSkuData(skuDataArray);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (planningData.length && StoreData.length && SkuData.length) {
      prepareData();
    }
  }, [planningData, StoreData, SkuData]);

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
  };

  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="Planning">
      <Table<DataType>
        columns={columns}
        dataSource={paginatedData}
        pagination={{ current: currentPage, pageSize, total: data.length }}
        onChange={handleTableChange}
        scroll={{ x: 'max-content' }}
        loading={loading}
      />
    </div>
  );
};

export default Planning;
