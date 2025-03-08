import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import sampleData from '../../assets/sample-data.xlsx'; 
import { Table, Button, Modal, Form, Input, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TableColumnsType, TableProps } from 'antd';
import '../../common-style.css';

interface DataType {
  key: React.Key;
  Sno: string;
  Label: string;
  City: string;
  State: string;
}

const Store = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<React.Key | null>(null);

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <EditOutlined className="icon-action" onClick={() => handleEdit(record)} />
          <DeleteOutlined className="icon-action" onClick={() => handleDelete(record.key)} />
        </>
      ),
    },
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
      filters: Array.from(new Set(data.map(item => item.Label))).map(store => ({
        text: store,
        value: store,
      })),
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.Label.startsWith(value as string),
      width: '30%',
      render: (text) => text,
    },
    {
      title: 'City',
      dataIndex: 'City',
      sorter: (a, b) => a.City.localeCompare(b.City),
      onFilter: (value, record) => record.City.startsWith(value as string),
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: 'State',
      dataIndex: 'State',
      sorter: (a, b) => a.State.localeCompare(b.State),
      onFilter: (value, record) => record.State.startsWith(value as string),
      filterSearch: true,
      width: '40%',
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
  ];
  
  

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

  const handleAddStore = () => {
    form.validateFields().then(values => {
      if (editingKey !== null) {
        const updatedData = data.map(item => 
          item.key === editingKey ? { ...item, Label: values.label, City: values.city, State: values.state } : item
        );
        setData(updatedData);
        updateXlsxSheet(updatedData);
      } else {
        const newStore: DataType = {
          key: data.length,
          Sno: (data.length + 1).toString(),
          Label: values.label,
          City: values.city,
          State: values.state,
        };
        const updatedData = [...data, newStore];
        setData(updatedData);
        updateXlsxSheet(updatedData);
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingKey(null);
    });
  };

  const handleEdit = (record: DataType) => {
    setEditingKey(record.key);
    form.setFieldsValue({
      label: record.Label,
      city: record.City,
      state: record.State,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (key: React.Key) => {
    const updatedData = data.filter(item => item.key !== key);
    setData(updatedData);
    updateXlsxSheet(updatedData);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingKey(null);
  };

  const updateXlsxSheet = (updatedData: DataType[]) => {
    fetch(sampleData)
      .then(response => response.arrayBuffer())
      .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = XLSX.utils.json_to_sheet(updatedData);
        workbook.Sheets['Stores'] = worksheet;
        const updatedWorkbook = XLSX.write(workbook, { type: 'array' });
        // Here you can send the updatedWorkbook to your server or handle it as needed
      });
  };

  useEffect(() => {
    readStoresSheet();
  }, []);

  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <div className='table-container'>
      <Table<DataType> 
        columns={columns}
        dataSource={data} 
        onChange={onChange}
        footer={() => (
          <div className='btn-container'>
            <Button type="primary" onClick={showModal}>
              New Store
            </Button>
          </div>
        )}
      />
      <Modal
        title={editingKey !== null ? "Edit Store" : "Add New Store"}
        visible={isModalVisible}
        onOk={handleAddStore}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="label"
            label="Store Name"
            rules={[{ required: true, message: 'Please input the store label!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="city"
            label="Store City"
            rules={[{ required: true, message: 'Please input the store city!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="state"
            label="Store State"
            rules={[{ required: true, message: 'Please input the store state!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Store;