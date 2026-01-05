import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getImgProduct } from "../../shared/ultils";
import { currencyType } from "../../shared/constants/currency-type";
import { UPDATE_CART, DELETE_CART } from "../../shared/constants/action-type";
import { getProfile, postOrder, deleteAddress, getPaymentUrl, updateCart } from "../../services/Api";
import AddAddress from "../../shared/components/Address/AddAddress";
import EditAddress from "../../shared/components/Address/EditAddress";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
const Cart = () => {
    const navigate = useNavigate();
    const items = useSelector(({ cart }) => cart.items);
    const dispatch = useDispatch();
    const [profile, setProfile] = React.useState({});
    const [paymentMethod, setPaymentMethod] = React.useState('cod');
    const [selectedAddressId, setSelectedAddressId] = React.useState(null);
    const [showAddAddress, setShowAddAddress] = React.useState(false);
    const [showEditAddress, setShowEditAddress] = React.useState(false);
    const [editAddress, setEditAddress] = React.useState(null);
    const emailRegex = /[^@]{2,64}@[^.]{2,253}\.[0-9a-z-.]{2,63}/;
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const { isLoggedIn } = useAuth();

    React.useEffect(() => {
        if (isLoggedIn) {
            getProfile({}).then(({ data }) => {
                if (data.status == "success") {
                    const p = data.data || {};
                    setProfile(p);
                    if (p.addresses && p.addresses.length > 0) {
                        const def = p.addresses.find((a) => a.is_default) || p.addresses[0];
                        setSelectedAddressId(def._id);
                    }
                }
            });
        }
    }, [isLoggedIn]);

    const onChangeInfo = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };
    const handelUpdateCart = async (id, e) => {
        const qty = parseInt(e.target.value);
        if (isLoggedIn) await updateCart({product_id: id, quantity: qty});
        if (qty <= 0) handleDeleteCart(e, id)
        dispatch({
            type: UPDATE_CART,
            payload: {
                _id: id,
                qty: parseInt(qty),
            }
        })

    }
    const handleDeleteCart = async (e, id) => {
        e.preventDefault();
        console.log("Delete cart item", id);
        if (isLoggedIn) await updateCart({product_id: id, quantity: -1});
        dispatch({
            type: DELETE_CART,
            payload: {
                _id: id,
            }
        })
    }

    const [formError, setFormError] = React.useState(null);
    const [formSuccess, setFormSuccess] = React.useState(null);

    const order = (e) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);
        const orderInfo = { ...profile, items };
        // attach selected address
        if (selectedAddressId && profile.addresses) {
            orderInfo.address = profile.addresses.find((a) => a._id === selectedAddressId);
        } 
        if ((!selectedAddressId || !profile.addresses) && !orderInfo.add){
            setFormError("Chưa có địa chỉ nhận hàng");
            return;
        }

        if (!emailRegex.test(orderInfo.email || "")) {
            setFormError("Email không hợp lệ");
            return;
        }
        if (!phoneRegex.test(orderInfo.phone || "")) {
            setFormError("Số điện thoại không hợp lệ");
            return;
        }
        if (orderInfo.items.length < 1) {
            setFormError("Giỏ hàng trống");
            return;
        }

        // submit
        else {
            if (paymentMethod === 'installment') {
                // send full order info to server so it can create a pending order and return payment url
                const payload = {
                    name: orderInfo.full_name || orderInfo.name,
                    mail: orderInfo.email || orderInfo.mail,
                    phone: orderInfo.phone,
                    add: orderInfo.add || orderInfo.address.ward + " " + orderInfo.address.province + " " + orderInfo.address.detail,
                    items,
                    paymentMethod: 'vnpay'
                };
                getPaymentUrl(payload, {}).then(({ data }) => {
                    if (data.status === "success") {
                        // keep a local fallback pending order in case client needs it
                        try {
                            const pending = { ...payload };
                            localStorage.setItem('pendingOrder', JSON.stringify(pending));
                            localStorage.setItem('pendingPayment', 'vnpay');
                        } catch (e) {
                            console.warn('Could not save pending order', e);
                        }
                        console.log(data);
                        navigate(data.url);
                    } else {
                        setFormError("Đặt hàng thất bại!");
                    }
                }).catch((err) => {
                    setFormError("Lỗi khi kết nối đến cổng thanh toán");
                });
                return;
            } else {
                const payload = {
                    name: orderInfo.full_name || orderInfo.name,
                    mail: orderInfo.email,
                    phone: orderInfo.phone,
                    add: orderInfo.add || orderInfo.address.detail + " " + orderInfo.address.ward + " " + orderInfo.address.province,
                    items,
                    paymentMethod: 'cod'
                };
                postOrder(payload, {}).then(({ data }) => {
                    if (data.status == "success") {
                        items.map(async (item) => {
                            await updateCart({product_id: item._id, quantity: -1});
                            dispatch({
                                type: DELETE_CART,
                                payload: {
                                    _id: item._id,
                                }
                            })
                        })
                        navigate('/success');
                    } else setFormError("Đặt hàng thất bại!");
                })
            }
        };

    }

    const handleAddAddressSuccess = (newAddress) => {
        let addresses = profile.addresses ? [...profile.addresses] : [];
        if (newAddress.is_default) {
            addresses = addresses.map((a) => ({ ...a, is_default: false }));
        }
        addresses.push(newAddress);
        setProfile({ ...profile, addresses });
        setShowAddAddress(false);
        setSelectedAddressId(newAddress._id);
    };

    const handleEditAddressSuccess = (updatedAddress) => {
        let addresses = (profile.addresses || []).map((a) => (a._id === updatedAddress._id ? updatedAddress : a));
        if (updatedAddress.is_default) {
            addresses = addresses.map((a) => (a._id === updatedAddress._id ? a : { ...a, is_default: false }));
        }
        setProfile({ ...profile, addresses });
        setShowEditAddress(false);
        setEditAddress(null);
        setSelectedAddressId(updatedAddress._id);
    };

    return (
        <>
            <div>
                {/*	Cart	*/}
                <div id="my-cart">
                    <div className="row">
                        <div className="cart-nav-item col-lg-7 col-md-7 col-sm-12">Thông tin sản phẩm</div>
                        <div className="cart-nav-item col-lg-2 col-md-2 col-sm-12">Tùy chọn</div>
                        <div className="cart-nav-item col-lg-3 col-md-3 col-sm-12">Giá</div>
                    </div>
                    <form method="post">
                    </form>
                    <div>
                        {items.map((item) => (
                            <div key={item._id} className="cart-item row">
                                <div className="cart-thumb col-lg-7 col-md-7 col-sm-12">
                                    <img src={getImgProduct(item.thumbnail)} />
                                    <h4>{item.name}</h4>
                                </div>
                                <div className="cart-quantity col-lg-2 col-md-2 col-sm-12">
                                    <input type="number" id="quantity" className="form-control form-blue quantity" onChange={(e) => handelUpdateCart(item._id, e)} value={item.qty}></input>
                                </div>
                                <div className="cart-price col-lg-3 col-md-3 col-sm-12"><b>{currencyType(item.qty * item.price)}</b><a onClick={(e) => handleDeleteCart(e, item._id)} href="#">Xóa</a></div>
                            </div>
                        ))}
                    </div>


                    <div className="row">
                        <div className="cart-thumb col-lg-7 col-md-7 col-sm-12">
                        </div>
                        <div className="cart-total col-lg-2 col-md-2 col-sm-12"><b>Tổng cộng:</b></div>
                        <div className="cart-price col-lg-3 col-md-3 col-sm-12"><b>{currencyType(items.reduce((total, item) => total + item.qty * item.price, 0))}</b></div>
                    </div>
                </div>
                {/*	End Cart	*/}
                {/*	Customer Info	*/}
                <div id="customer">
                    {isLoggedIn ? (<form method="post">
                        <div className="order-card">
                            <h3>Thông tin đặt hàng</h3>
                            <div className="order-field"><div className="label">Họ và tên</div><div>{profile.full_name || "(Chưa có)"}</div></div>
                            <div className="order-field"><div className="label">Số điện thoại</div><div>{profile.phone || "(Chưa có)"}</div></div>
                            <div className="order-field"><div className="label">Email</div><div>{profile.email || "(Chưa có)"}</div></div>
                            <div className="order-field"><div className="label">Địa chỉ</div>
                                <div style={{ flex: 1 }}>
                                    {profile.addresses && profile.addresses.length > 0 ? (
                                        <div className="addresses-selection">
                                            {profile.addresses.map((a) => (
                                                <div key={a._id} className="address-item">
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <input type="radio" name="selectedAddress" value={a._id} checked={selectedAddressId === a._id} onChange={() => setSelectedAddressId(a._id)} />
                                                        <div style={{ marginLeft: 8 }}>
                                                            <div style={{ fontWeight: 600 }}>{a.detail}</div>
                                                            <div style={{ color: "#666", fontSize: 13 }}>{a.ward}, {a.province} {a.is_default && <span className="badge bg-primary">Mặc định</span>}</div>
                                                        </div>
                                                    </div>
                                                    <div className="address-actions">
                                                        <button className="btn btn-sm btn-outline-primary" onClick={(e) => { e.preventDefault(); setEditAddress(a); setShowEditAddress(true); }}>Sửa</button>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={async (e) => { e.preventDefault(); if (!window.confirm("Bạn có chắc muốn xoá địa chỉ này?")) return; try { const res = (await deleteAddress(a._id)).data; if (res.status === "success") { const newAddrs = profile.addresses.filter(x => x._id !== a._id); setProfile({ ...profile, addresses: newAddrs }); if (selectedAddressId === a._id) { if (newAddrs.length > 0) setSelectedAddressId(newAddrs[0]._id); else setSelectedAddressId(null); } } } catch (err) { setFormError("Lỗi khi xoá địa chỉ"); } }}>Xoá</button>
                                                    </div>
                                                </div>
                                            ))}
                                            <div style={{ marginTop: 8 }}>
                                                <button className="btn btn-sm btn-success" onClick={(e) => { e.preventDefault(); setShowAddAddress(true); }}>+ Thêm địa chỉ</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{ marginTop: 8 }}>
                                                <button className="btn btn-sm btn-success" onClick={(e) => { e.preventDefault(); setShowAddAddress(true); }}>+ Thêm địa chỉ</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="order-field">
                                <div className="label">Phương thức thanh toán</div>
                                <div>
                                    <label className="payment-option" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                        <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                        Thanh toán khi nhận hàng
                                    </label>
                                    <label className="payment-option" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginLeft: 12 }}>
                                        <input type="radio" name="payment" value="installment" checked={paymentMethod === 'installment'} onChange={() => setPaymentMethod('installment')} />
                                        Thanh toán trực tuyến
                                    </label>
                                </div>
                            </div>
                        </div>
                    </form>) : (
                        <form method="post">
                            <div className="row">
                                <div id="customer-name" className="col-lg-4 col-md-4 col-sm-12">
                                    <input onChange={(e) => onChangeInfo(e)} placeholder="Họ và tên (bắt buộc)" type="text" name="name" className="form-control" required />
                                </div>
                                <div id="customer-phone" className="col-lg-4 col-md-4 col-sm-12">
                                    <input onChange={(e) => onChangeInfo(e)} placeholder="Số điện thoại (bắt buộc)" type="text" name="phone" className="form-control" required />
                                </div>
                                <div id="customer-mail" className="col-lg-4 col-md-4 col-sm-12">
                                    <input onChange={(e) => onChangeInfo(e)} placeholder="Email (bắt buộc)" type="email" name="email" className="form-control" required />
                                </div>
                                <div id="customer-add" className="col-lg-12 col-md-12 col-sm-12">
                                    <input onChange={(e) => onChangeInfo(e)} placeholder="Địa chỉ nhà riêng hoặc cơ quan (bắt buộc)" type="text" name="add" className="form-control" required />
                                </div>
                            </div>
                            <div className="order-field">
                                <div className="label">Phương thức thanh toán</div>
                                <div>
                                    <label className="payment-option" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                        <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                        Thanh toán khi nhận hàng
                                    </label>
                                    <label className="payment-option" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginLeft: 12 }}>
                                        <input type="radio" name="payment" value="installment" checked={paymentMethod === 'installment'} onChange={() => setPaymentMethod('installment')} />
                                        Thanh toán trực tuyến
                                    </label>
                                </div>
                            </div>
                        </form>
                    )}

                    <div className="row">
                        <div className="col-12">
                            {formError && <div className="message-error">{formError}</div>}
                            {formSuccess && <div className="message-success">{formSuccess}</div>}
                            <div className="checkout-buttons">
                                <button className="btn-checkout btn-primary-checkout" onClick={(e) => order(e)}>Mua ngay<br /><small style={{ display: "block", color: "rgba(255,255,255,0.9)" }}>Giao hàng tận nơi siêu tốc</small></button>
                            </div>
                        </div>
                    </div>

                    {/* Add/Edit address modals */}
                    {showAddAddress && (
                        <AddAddress
                            onClose={() => setShowAddAddress(false)}
                            onSuccess={handleAddAddressSuccess}
                        />
                    )}

                    {showEditAddress && editAddress && (
                        <EditAddress
                            address={editAddress}
                            onClose={() => { setShowEditAddress(false); setEditAddress(null); }}
                            onSuccess={handleEditAddressSuccess}
                        />
                    )}
                </div>
                {/*	End Customer Info	*/}
            </div>

        </>
    )
}
export default Cart;