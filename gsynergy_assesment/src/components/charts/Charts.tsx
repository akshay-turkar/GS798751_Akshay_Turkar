import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import sampleData from '../../assets/sample-data.xlsx'; 
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { Spin } from 'antd'; // Import Spin component
import '../../common-style.css';

interface DataType {
  week: string;
  gmDollars: number;
  gmPercent: number;
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

const Charts = () => {
  const [planningData, setPlanningData] = useState<PlanningDataType[]>([]);
  const [StoreData, setStoreData] = useState<StoreDataType[]>([]);
  const [SkuData, setSkuData] = useState<SkuDataType[]>([]);
  const [data, setData] = useState<DataType[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  const readPlanningSheet = async () => {
    try {
      const response = await fetch(sampleData);
      const data = await response.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = 'Planning';
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<PlanningDataType>(worksheet);
      const dataArray = jsonData.map((item, index) => ({ ...item, key: index }));
      setPlanningData(dataArray);
    } catch (error) {
      console.error('Error reading SKUs sheet:', error);
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
      const dataArray = jsonData.map((item, index) => ({ ...item, key: index }));
      setStoreData(dataArray);
    } catch (error) {
      console.error('Error reading Stores sheet:', error);
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
      const dataArray = jsonData.map((item, index) => ({ ...item, key: index }));
      setSkuData(dataArray);
    } catch (error) {
      console.error('Error reading SKUs sheet:', error);
    }
  };

  const prepareData = () => {
    const weekData = planningData
      .filter(item => item.Store === selectedStore)
      .reduce((acc: { [key: string]: { gmDollars: number; gmPercent: number; count: number } }, item) => {
        const sku = SkuData.find(sku => sku.ID === item.SKU);
        const price = sku ? sku.Price : 0;
        const cost = sku ? sku.Cost : 0;
        const salesDollars = item.SalesUnits * price;
        const gmDollars = salesDollars - (item.SalesUnits * cost);
        const gmPercent = (gmDollars / salesDollars) * 100;

        if (!acc[item.Week]) {
          acc[item.Week] = { gmDollars: 0, gmPercent: 0, count: 0 };
        }
        acc[item.Week].gmDollars += gmDollars;
        acc[item.Week].gmPercent += gmPercent;
        acc[item.Week].count += 1;

        return acc;
      }, {});

    const mappedData = Object.keys(weekData).map(week => ({
      week,
      gmDollars: weekData[week].gmDollars,
      gmPercent: weekData[week].gmPercent / weekData[week].count,
    }));

    setData(mappedData);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching data
      await readPlanningSheet();
      await readStoresSheet();
      await readSkusSheet();
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (planningData.length && StoreData.length && SkuData.length) {
      prepareData();
    }
    if (StoreData.length > 0 && !selectedStore) {
      setSelectedStore(StoreData[0].ID);
    }
  }, [planningData, StoreData, SkuData, selectedStore, StoreData]);

  return (
    <Spin spinning={loading} size="large"> 
      <div style={{ width: "100%", height: 400 }}>
        <select
          onChange={(e) => setSelectedStore(e.target.value)}
          value={selectedStore}
          style={{
            padding: '8px',
            margin: '10px 10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            
          }}
        >
          <option value="">Select Store</option>
          {StoreData.map(store => (
            <option key={store.ID} value={store.ID}>{store.Label}</option>
          ))}
        </select>
        <ResponsiveContainer>
          <ComposedChart data={data}>
            {/* X-Axis */}
            <XAxis dataKey="week" />

            {/* Left Y-Axis for GM Dollars */}
            <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `$${value.toLocaleString()}`} />

            {/* Right Y-Axis for GM Percent */}
            <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />

            {/* Tooltip */}
            <Tooltip formatter={(value, name) => (name === "gmDollars" ? `$${value.toLocaleString()}` : `${value}%`)} />

            {/* Legend */}
            <Legend />

            {/* Bar for GM Dollars */}
            <Bar yAxisId="left" dataKey="gmDollars" fill="#3b82f6" name="GM Dollars" />

            {/* Line for GM Percent */}
            <Line yAxisId="right" dataKey="gmPercent" stroke="#f97316" strokeWidth={2} name="GM %" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Spin>
  );
};

export default Charts;
