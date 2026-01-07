
import React from 'react';
import { Table, Tag } from 'antd';
import { getUsers, setBanStatus } from '../../shared/api/api';

const Users = () => {
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);

    React.useEffect(() => {
        setLoading(true);
        getUsers({ params: { page: page, limit: 10 } }).then(({ data }) => {
            setUsers(data.data.docs);
            setTotal(data.pages.totalRows);
            setLoading(false);
        });
    }, [page]);

    const handleChangePage = (pagination) => {
        setPage(pagination.current);
    };

    const handleToggleBan = async (record) => {
        try {
            await setBanStatus(record._id, { is_banned: !record.is_banned });
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === record._id ? { ...user, is_banned: !user.is_banned } : user
                )
            );
        } catch (error) {
            console.error("Error toggling ban status:", error);
        }
    };

    const columns = [
        {
            title: 'ID',
            width: 60,
            render: (_, __, index) => (page - 1) * 10 + index + 1,
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
        },
        {
            title: 'Trang thái',
            dataIndex: 'is_banned',
            render: (is_banned, record) => (is_banned ?
                <Tag style={{ cursor: 'pointer' }} color="red" onClick={() => handleToggleBan(record)}>Bị ban</Tag> :
                <Tag style={{ cursor: 'pointer' }} color="green" onClick={() => handleToggleBan(record)}>Hoạt động</Tag>),
        },
    ];
    return (
        <div>
            <h2>Quản lý người dùng</h2>
            <Table
                columns={columns}
                dataSource={users}
                rowKey="_id"
                loading={loading}
                pagination={{
                    current: page,
                    pageSize: 10,
                    total: total,
                }}
                onChange={handleChangePage}
            />
        </div>
    );
};

export default Users;