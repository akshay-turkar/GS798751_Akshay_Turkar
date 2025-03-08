import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import sampleData from '../../assets/sample-data.xlsx'; 
import { Table, Button, Modal, Form, Input, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TableColumnsType, TableProps } from 'antd';
import '../../common-style.css';

interface DataType {
  key: React.Key;
  Label: string;
  Price: number;
  Cost: number;
}

const Sku = () => {
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
      title: 'Label',
      dataIndex: 'Label',
      filters: Array.from(new Set(data.map(item => item.Label))).map(label => ({
        text: label,
        value: label,
      })),
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.Label.startsWith(value as string),
      width: '30%',
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: 'Price',
      dataIndex: 'Price',
      sorter: (a, b) => a.Price - b.Price,
      render: (text) => <Tooltip title={`$ ${text}`}>{`$ ${text}`}</Tooltip>,
    },
    {
      title: 'Cost',
      dataIndex: 'Cost',
      sorter: (a, b) => a.Cost - b.Cost,
      render: (text) => <Tooltip title={`$ ${text}`}>{`$ ${text}`}</Tooltip>,
    },
  ];

  // Read the "SKUs" sheet from the sample-data.xlsx file
  const readSkusSheet = async () => {
    try {
      const response = await fetch(sampleData);
      const data = await response.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = 'SKUs';
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<DataType>(worksheet);
      const dataArray = jsonData.map((item, index) => ({ ...item, key: index }));
      setData(dataArray);
    } catch (error) {
      console.error('Error reading SKUs sheet:', error);
    }
  };

  const handleAddSku = async () => {
    try {
      const values = await form.validateFields();
      if (editingKey !== null) {
        const updatedData = data.map(item => 
          item.key === editingKey ? { ...item, Label: values.label, Price: values.price, Cost: values.cost } : item
        );
        setData(updatedData);
        await updateXlsxSheet(updatedData);
      } else {
        const newSku: DataType = {
          key: data.length,
          Label: values.label,
          Price: values.price,
          Cost: values.cost,
        };
        const updatedData = [...data, newSku];
        setData(updatedData);
        await updateXlsxSheet(updatedData);
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingKey(null);
    } catch (error) {
      console.error('Error adding SKU:', error);
    }
  };

  const handleEdit = (record: DataType) => {
    setEditingKey(record.key);
    form.setFieldsValue({
      label: record.Label,
      price: record.Price,
      cost: record.Cost,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (key: React.Key) => {
    try {
      const updatedData = data.filter(item => item.key !== key);
      setData(updatedData);
      await updateXlsxSheet(updatedData);
    } catch (error) {
      console.error('Error deleting SKU:', error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingKey(null);
  };

  const updateXlsxSheet = async (updatedData: DataType[]) => {
    try {
      const response = await fetch(sampleData);
      const data = await response.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = XLSX.utils.json_to_sheet(updatedData);
      workbook.Sheets['SKUs'] = worksheet;
      const updatedWorkbook = XLSX.write(workbook, { type: 'array' });
      // Here you can send the updatedWorkbook to your server or handle it as needed
    } catch (error) {
      console.error('Error updating XLSX sheet:', error);
    }
  };

  useEffect(() => {
    readSkusSheet();
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
              New SKU
            </Button>
          </div>
        )}
      />
      <Modal
        title={editingKey !== null ? "Edit SKU" : "Add New SKU"}
        visible={isModalVisible}
        onOk={handleAddSku}
        onCancel={handleCancel}
        okButtonProps={{ disabled: form.getFieldsError().some(({ errors }) => errors.length > 0) }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="label"
            label="SKU Label"
            rules={[{ required: true, message: 'Please input the SKU label!' }, { type: 'string' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="SKU Price"
            rules={[{ required: true, message: 'Please input the SKU price!' }, { type: 'number', transform: value => parseFloat(value) }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="cost"
            label="SKU Cost"
            rules={[{ required: true, message: 'Please input the SKU cost!' }, { type: 'number', transform: value => parseFloat(value) }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Sku;
