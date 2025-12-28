
import React from "react";
import { Modal, Form, Input } from 'antd';
import { createCategory, updateCategory } from "../../shared/api/api";



const CreateCategoryModal = ({ visible, onCancel, data }) => {
    const [form] = Form.useForm();
    React.useEffect(() => {
        if (data) {
            form.setFieldsValue({
                title: data.title,
                description: data.description,
            });
        }
    }, [data, form]);

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                console.log(values);
                if (data) {
                    updateCategory(data._id, values);
                } else {
                    createCategory(values);
                }
                form.resetFields();
                onCancel();

            })
            .catch(info => {
                console.log("Lỗi:", info);
            });
    };

    return (
        <Modal
            title="Create New Category"
            open={visible}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={handleOk}
            okText="Tạo"
            cancelText="Hủy"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="title"
                    label="Tên loại"
                    rules={[{ required: true, message: "Vui lòng nhập tên loại" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[{ required: false, message: "Vui lòng nhập mô tả" }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateCategoryModal;
