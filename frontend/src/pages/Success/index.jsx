import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Success = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    window.scrollTo(0, 0);

    useEffect(() => {
        try {
            localStorage.removeItem('pendingOrder'); 
            localStorage.removeItem('pendingPayment');
        } catch (e) { }

    }, [dispatch]);

    return (
        <>
            {/*	Order Success	*/}
            <div id="order-success">
                <div className="row">
                    <div id="order-success-img" className="col-lg-3 col-md-3 col-sm-12" />
                    <div id="order-success-txt" className="col-lg-9 col-md-9 col-sm-12">
                        <h3>'Bạn đã đặt hàng thành công !</h3>
                        <div style={{ marginTop: 12 }}>
                            <button className="btn btn-primary" onClick={() => navigate('/')}>Quay về trang chủ</button>
                        </div>
                    </div>
                </div>
            </div>
            {/*	End Order Success	*/}

        </>
    )
}
export default Success;