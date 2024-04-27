import React from 'react';
import { Modal, Form, Input, DatePicker ,Select,Button} from 'antd';

const AddExpenseModal = ({
    isExpenseModalVisible,
    handleExpenseCancel,
    onFinish
}) => {
    const [form] = Form.useForm(); // Corrected typo here

    return (
        <Modal
            style={{ fontWeight: 600 }}
            title="Add Expense"
            visible={isExpenseModalVisible}
            onCancel={handleExpenseCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => {
                    onFinish(values, "expense");
                    form.resetFields();
                }}
            >
                <Form.Item
                    style={{ fontWeight: 600 }}
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Please Select the name of transaction!"
                        }
                    ]}
                >
                    <Input type="text" className="custom-input" />
                </Form.Item>
                <Form.Item
                    style={{ fontWeight: 600 }}
                    label="Amount"
                    name="amount"
                    rules={[
                        {
                            required: true,
                            message: "Please Input the Expense Amount"
                        }
                    ]}
                >
                    <Input type="number" className="custom-input" />
                </Form.Item>
                <Form.Item
                    style={{ fontWeight: 600 }}
                    label="Date"
                    name="date"
                    rules={[
                        {
                            required: true,
                            message: "Please Select the date of transaction!"
                        }
                    ]}
                >
                    <DatePicker className="custom-input" />
                </Form.Item>
                <Form.Item
          label="Tag"
          name="tag"
          style={{ fontWeight: 600 }}
          rules={[{ required: true, message: "Please select a tag!" }]}
        >
          <Select className="select-input-2">
            <Select.Option value="food">Food</Select.Option>
            <Select.Option value="education">Education</Select.Option>
            <Select.Option value="others">Others</Select.Option>
            {/* Add more tags here */}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button className="btn btn-blue" type="primary" htmlType="submit">
            Add Expense
          </Button>
        </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddExpenseModal;
