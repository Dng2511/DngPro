import React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DELETE_CART } from "../../shared/constants/action-type";
import { getVnpayStatus } from "../../services/Api";


const PaymentSuccess = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [message, setMessage] = useState('Xử lý thanh toán...');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const vnpStatus = params.get('vnp_TransactionStatus') || params.get('vnp_ResponseCode');
        const txnRef = params.get('vnp_TxnRef');

        // Clear any pending order local fallback
        let pendingRaw = null;
        try {
            pendingRaw = localStorage.getItem('pendingOrder');
        } catch (e) { /* ignore */ }

        if (txnRef) {
            // Ask backend for trusted status
            setMessage('Đang kiểm tra trạng thái thanh toán...');
            getVnpayStatus(txnRef).then(({ data }) => {
                if (data.status === 'success') {
                    const st = data.data.status;
                    if (st === 'paid') {
                        // clear local fallback cart
                        if (pendingRaw) {
                            try {
                                const pending = JSON.parse(pendingRaw);
                                if (pending && pending.items) pending.items.forEach(item => dispatch({ type: DELETE_CART, payload: { _id: item._id } }));
                            } catch (e) { /* ignore */ }
                        }
                        try { localStorage.removeItem('pendingOrder'); localStorage.removeItem('pendingPayment'); } catch (e) {}
                        setMessage(`Thanh toán thành công${txnRef ? ' (Ref: ' + txnRef + ')' : ''}. Đơn hàng đã được lưu.`);
                    } else if (st === 'pending') {
                        setMessage('Thanh toán đang được xử lý, vui lòng chờ vài phút.');
                    } else {
                        setMessage('Thanh toán không thành công hoặc đã hủy. Vui lòng thử lại.');
                    }
                } else {
                    setMessage('Không thể kiểm tra trạng thái thanh toán.');
                }
            }).catch(err => {
                console.error(err);
                setMessage('Lỗi khi kiểm tra trạng thái thanh toán.');
            });
            return;
        }

        if (vnpStatus === '00') {
            // success fallback
            if (pendingRaw) {
                try {
                    const pending = JSON.parse(pendingRaw);
                    if (pending && pending.items) {
                        pending.items.forEach(item => {
                            dispatch({ type: DELETE_CART, payload: { _id: item._id } });
                        });
                    }
                } catch (e) { /* ignore */ }
            }
            try { localStorage.removeItem('pendingOrder'); localStorage.removeItem('pendingPayment'); } catch (e) {}
            setMessage('Thanh toán thành công. Đơn hàng đã được lưu.');
        } else if (vnpStatus) {
            try { localStorage.removeItem('pendingPayment'); } catch (e) {}
            setMessage('Thanh toán không thành công hoặc đã hủy. Vui lòng thử lại.');
        } else {
            setMessage('Không có thông tin thanh toán. Nếu bạn vừa thanh toán, vui lòng kiểm tra lại.');
        }
    }, [dispatch]);

    return (
        <>
            <div id="payment-success">
                <div className="row">
                    <div id="order-success-img" className="col-lg-3 col-md-3 col-sm-12" />
                    <div id="order-success-txt" className="col-lg-9 col-md-9 col-sm-12">
                        <h3>{message}</h3>
                        <div style={{ marginTop: 12 }}>
                            <button className="btn btn-primary" onClick={() => navigate('/')}>Quay về trang chủ</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentSuccess;