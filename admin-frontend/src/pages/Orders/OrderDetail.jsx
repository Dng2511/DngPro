import { Modal, Table, Image } from "antd";
import ImageLink from "../../shared/components/ImageLink";

const OrderDetail = ({ open, onCancel, data }) => {
    if (!data) return null;

    const columns = [
        {
            title: "Sản phẩm",
            dataIndex: ["prd_id", "name"],
            key: "name",
        },
        {
            title: "Hình ảnh",
            dataIndex: ["prd_id", "thumbnail"],
            key: "thumbnail",
            render: (img) => (
                <Image
                    width={60}
                    src={ImageLink(img)} // chỉnh path nếu cần
                    alt="product"
                />
            ),
        },
        {
            title: "Số lượng",
            dataIndex: "qty",
            key: "qty",
            align: "center",
        },
        {
            title: "Đơn giá",
            dataIndex: "price",
            key: "price",
            align: "right",
            render: (price) =>
                price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }),
        },
        {
            title: "Thành tiền",
            key: "total",
            align: "right",
            render: (_, record) =>
                (record.qty * record.price).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }),
        },
    ];

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            width={800}
            title={`Chi tiết đơn hàng ${data._id}`}
        >
            <Table
                rowKey="_id"
                columns={columns}
                dataSource={data.items}
                pagination={false}
            />
        </Modal>
    );
};

export default OrderDetail;

