import React from "react";

const Footer = () => {
    return (
        <>
            <div id="footer-top">
                <div className="container">
                    <div className="row">
                        <div id="address" className="col-lg-4 col-md-4 col-sm-12">
                            <h3>Địa chỉ</h3>
                            <p>Số 1 Đại Cồ Việt - Hai Bà Trưng - Hà Nội</p>
                        </div>
                        <div id="service" className="col-lg-4 col-md-4 col-sm-12">
                            <h3>Dịch vụ</h3>
                            <p>Bảo hành rơi vỡ, ngấm nước Care Diamond</p>
                            <p>Bảo hành Care X60 rơi vỡ ngấm nước vẫn Đổi mới</p>
                        </div>
                        <div id="hotline" className="col-lg-4 col-md-4 col-sm-12">
                            <h3>Hotline</h3>
                            <p>Phone Sale: (+84) 0936 363 636</p>
                            <p>Email: Dong.PV225702@sis.hust.edu.vn</p>
                        </div>
                    </div>
                </div>
            </div>
            {/*	Footer	*/}
            <div id="footer-bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12">
                            <p>
                                2018 © Vietpro Academy. All rights reserved. Developed by Vietpro Software.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/*	End Footer	*/}
        </>
    )
}
export default Footer;