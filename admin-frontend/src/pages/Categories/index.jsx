import React from "react";
import { deleteCategory, getCategories } from "../../shared/api/api";
import { Table, Button } from 'antd';
import CreateCategoryModal from "./CreateCategoryModal";
import { DeleteFilled, EditOutlined } from '@ant-design/icons';


const Categories = () => {
    const [categories, setCategories] = React.useState([]);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        getCategories().then(({ data }) => {
            console.log(data);
            setCategories(data.data.docs);
        });

    }, [isModalVisible])

    const handleDelete = async (id) => {
        try {
            await deleteCategory(id)
            setCategories(prev => prev.filter(item => item._id !== id));
        } catch (e) {
            alert(e);
        }
    }

    const handleUpdate = (record) => {
        setData(record);
        console.log(record);
        setIsModalVisible(true);
    }








    const columns = [
        {
            title: 'ID',
            width: 80,
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Tên loại',
            dataIndex: 'title',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
        },
        {
            title: 'Hành động',
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
        }

    ];

    return (
        <div>
            <h2>Categories</h2>
            <Button
                type="primary"
                style={{ marginBottom: 16 }}
                onClick={() => { 
                    setIsModalVisible(true) 
                    setData(null);
                }}
            >Add new Category</Button>
            <Table rowKey="_id" dataSource={categories} columns={columns} />
            <CreateCategoryModal
            
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                data={data}
            />
        </div>

    );
}

export default Categories;

