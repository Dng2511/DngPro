import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
  Button,
  Space,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  createProduct,
  updateProduct,
  getCategories,
} from "../../shared/api/api";
import ImageLink from "../../shared/components/ImageLink";

const { Option } = Select;
const { TextArea } = Input;

const CreateProductModal = ({ visible, onCancel, data }) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Load categories
  useEffect(() => {
    getCategories().then(({ data }) => {
      setCategories(data.data.docs);
    });
  }, []);

  // Set form when edit / reset when create
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        price: data.price,
        description: data.description,
        status: data.status,
        cat_id: data.cat_id,
        featured: data.featured,
        is_stock: data.is_stock,
      });

      if (data.thumbnail) {
        setPreview(
          ImageLink(data.thumbnail)
        );
      }
    } else {
      form.resetFields();
      setFile(null);
      setPreview(null);
    }
  }, [data, form]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("description", values.description || "");
      formData.append("cat_id", values.cat_id);
      formData.append("status", values.status);

      // REQUIRED fields
      formData.append("accessories", values.accessories);
      formData.append("warranty", values.warranty);
      formData.append("promotion", values.promotion);
      formData.append("featured", values.featured ? "true" : "false");
      formData.append("is_stock", values.is_stock ? "true" : "false");


      if (file) {
        formData.append("thumbnail", file);
      }

      if (data) {
        await updateProduct(data._id, formData);
      } else {
        await createProduct(formData);
      }

      onCancel();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      open={visible}
      title={data ? "Update Product" : "Create Product"}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={data ? "Update" : "Create"}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Product name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            formatter={(v) =>
              `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="cat_id"
          label="Category"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select category">
            {categories.map((cat) => (
              <Option key={cat._id} value={cat._id}>
                {cat.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Input placeholder="Máy mới 100%" />
        </Form.Item>

        <Form.Item name="accessories" label="Accessories">
          <Input placeholder="" />
        </Form.Item>

        <Form.Item name="warranty" label="Warranty">
          <Input placeholder="12 tháng" />
        </Form.Item>

        <Form.Item name="promotion" label="Promotion">
          <Input placeholder="Giảm giá 10%" />
        </Form.Item>

        <Form.Item
          name="featured"
          label="Featured"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="is_stock"
          label="In stock"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item label="Thumbnail">
          <Space align="center">
            {preview && (
              <img
                src={preview}
                alt="preview"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  objectFit: "cover",
                }}
              />
            )}

            <Upload
              beforeUpload={(file) => {
                setFile(file);
                setPreview(URL.createObjectURL(file));
                return false;
              }}
              showUploadList={false}
              accept="image/*"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>
                {preview ? "Change" : "Upload"}
              </Button>
            </Upload>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProductModal;
