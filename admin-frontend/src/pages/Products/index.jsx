import React from "react";
import { Table, Button, Image, Tag } from "antd";
import { DeleteFilled, EditOutlined } from "@ant-design/icons";
import { getProducts, deleteProduct } from "../../shared/api/api";
import CreateProductModal from "./CreateProductModal";
import ImageLink from "../../shared/components/ImageLink";

const Products = () => {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState();

 

  React.useEffect(() => {
    getProducts({params: { page: page, limit: 10 }}).then(({ data }) => {
      setProducts(data.data.docs);
      setTotal(data.pages.totalRows);
    });
  }, [page, isModalVisible]);


    const handleDelete = async (id) => {
      try {
        await deleteProduct(id);
        setProducts(products.filter((item) => item._id !== id));

      } catch (e) {
        alert("Delete failed");
      }
    };

    const handleUpdate = (record) => {
      setData(record);
      setIsModalVisible(true);
    };

    const handleChangePage = (pagination) => {
        setPage(pagination.current);
    };

    // ================= TABLE COLUMNS =================
    const columns = [
      {
        title: "ID",
        width: 60,
        render: (_, __, index) =>
          (page - 1) * 10 + index + 1,
      },
      {
        title: "Ảnh",
        dataIndex: "thumbnail",
        width: 100,
        render: (thumbnail) => (
          <Image
            width={60}
            src={ImageLink(thumbnail)}
          />
        ),
      },
      {
        title: "Tên sản phẩm",
        dataIndex: "name",
      },
      {
        title: "Giá",
        dataIndex: "price",
        render: (price) =>
          `${Number(price).toLocaleString("vi-VN")} ₫`,
      },
      {
        title: "Tình trạng",
        dataIndex: "status",
        render: (status) => <Tag color="blue">{status}</Tag>,
      },
      {
        title: "Nổi bật",
        dataIndex: "featured",
        render: (featured) =>
          featured ? <Tag color="green">Yes</Tag> : <Tag>No</Tag>,
      },
      {
        title: "Còn hàng",
        dataIndex: "is_stock",
        render: (is_stock) =>
          is_stock ? (
            <Tag color="green">In stock</Tag>
          ) : (
            <Tag color="red">Out stock</Tag>
          ),
      },
      {
        title: "Hành động",
        width: 160,
        render: (_, record) => (
          <>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleUpdate(record)}
            />
            <Button
              type="text"
              danger
              icon={<DeleteFilled />}
              onClick={() => handleDelete(record._id)}
            />
          </>
        ),
      },
    ];

    return (
      <div>
        <h2>Products</h2>

        <Button
          type="primary"
          style={{ marginBottom: 16 }}
          onClick={() => {
            setIsModalVisible(true);
            setData(null);
          }}
        >
          Add new Product
        </Button>

        <Table
          rowKey="_id"
          dataSource={products}
          columns={columns}
          loading={loading}
          pagination={{
            current: page,
            pageSize: 10,
            total: total,
            showSizeChanger: false, // cố định limit = 10
          }}
          onChange={handleChangePage}
        />

        <CreateProductModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          data={data}
        />
      </div>
    );
  };

  export default Products;
