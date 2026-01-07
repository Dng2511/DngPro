import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useAuth } from '../../shared/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onFinish = async (values) => {
    try {
      const res = await login(values.email, values.password);
      message.success('Đăng nhập thành công');
      const from = location.state?.from?.pathname || '/categories';
      navigate(from, { replace: true });
    } catch (err) {
      message.error('Đăng nhập thất bại');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card title="Admin Login" style={{ width: 360 }}>
        <Form name="login" layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email required' }]}> 
            <Input />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Password required' }]}> 
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;