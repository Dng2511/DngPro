import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getCommentsProduct, getProductDetails, postCommentsProduct, updateCart } from "../../services/Api";
import { getImgProduct } from "../../shared/ultils";
import moment from "moment/moment";
import { useDispatch } from "react-redux";
import { ADD_TO_CART } from "../../shared/constants/action-type";
import { currencyType } from "../../shared/constants/currency-type";
import Pagination from "../../shared/components/Pagination";
import { useAuth } from "../../hooks/useAuth";
const ProductDetails = () => {
    const param = useParams();
    const [searchParams] = useSearchParams();
    const navigate =useNavigate();
    const { isLoggedIn, user } = useAuth();
    const id = param.id;
    const page = searchParams.get("page") || 1;
    const dispatch = useDispatch();
    const [productDetails, setProductDetails] = React.useState({});
    const {name, thumbnail, accessories, status, promotion, price, is_stock, details} = productDetails;
    const [commentsList, setComment] = React.useState([]);
    const [inputComment, setInputComment] = React.useState({});
    const [pages, setPages] = React.useState({});
    const [commentError, setCommentError] = React.useState(null);
    const getComment = (id) => getCommentsProduct(id, {
        params: {
            page,
            limit: 10,
        }
    }).then(({ data }) => {
        setComment(data.data.docs)
        setPages(data.pages)});
    React.useEffect(() => {
        getProductDetails(id, {}).then(({ data }) => setProductDetails(data.data));
        getComment(id);
    }, [id, page]);
    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setInputComment({ ...inputComment, [name]: value })
    }

    const onSubmitComment = (e) => {
        e.preventDefault();
        
        if (!isLoggedIn) {
            setCommentError("Vui lòng đăng nhập để bình luận");
            return;
        }

        const payload = {
            ...inputComment,
            full_name: user?.full_name,
            email: user?.email,
        };

        postCommentsProduct(id, payload, {}).then(({ data }) => {
            if (data.status === "success") {
                setInputComment({});
                setCommentError(null);
                getComment(id);
            } else {
                setCommentError(data.message || "Gửi bình luận thất bại");
            }
        }).catch((err) => {
            setCommentError("Lỗi gửi bình luận");
        })
    }


    const addToCart = (type) =>{
        if (isLoggedIn) updateCart({product_id: id});
        dispatch({
            type: ADD_TO_CART,
            payload: {
                _id: id,
                name,
                thumbnail,
                price,
                qty: 1,
            }
        })
        if (type ==="buy-now") {
            return navigate("/cart");
        }
    }



    return (
        <>
            <div>
                {/*	List Product	*/}
                <div id="product">
                    <div id="product-head" className="row">
                        <div id="product-img" className="col-lg-6 col-md-6 col-sm-12">
                            <img src={getImgProduct(thumbnail)} alt=""/>
                        </div>
                        <div id="product-details" className="col-lg-6 col-md-6 col-sm-12">
                            <h1>{name}</h1>
                            <ul>
                                <li><span>Bảo hành:</span> 12 Tháng</li>
                                <li><span>Đi kèm:</span> {accessories === "undefined" ? "Không có phụ kiện đi kèm" : accessories}</li>
                                <li><span>Tình trạng:</span> {status}</li>
                                <li><span>Khuyến Mại:</span>{promotion==="undefined" ? "Không có khuyến mại" : promotion}</li>
                                <li id="price">Giá Bán (chưa bao gồm VAT)</li>
                                <li id="price-number">{currencyType(price)}</li>
                                <li id="status">{is_stock ? "Còn hàng" : "Hết hàng"}</li>
                            </ul>
                            <div id="add-cart">
                                <button onClick={() => addToCart("buy-now")} className="btn btn-warning mr-2">Mua ngay</button>
                                <button onClick={() => addToCart()} className="btn btn-info">Thêm vào giỏ hàng</button>
                            </div>


                        </div>
                    </div>
                    <div id="product-body" className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12">
                            <h3>Đánh giá về iPhone X 64GB</h3>
                            <p>{details}</p>
                        </div>
                    </div>
                    {/*	Comment	*/}
                    <div id="comment" className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12">
                            <h3>Bình luận sản phẩm</h3>
                            {!isLoggedIn ? (
                                <div style={{ padding: "16px", backgroundColor: "#fff3cd", border: "1px solid #ffc107", borderRadius: "4px", marginBottom: "16px" }}>
                                    <p style={{ margin: 0, color: "#856404" }}>Vui lòng <a href="/Login" style={{color:"#0c63e4"}}>đăng nhập</a> để bình luận sản phẩm.</p>
                                </div>
                            ) : (
                                <form method="post" onSubmit={onSubmitComment}>
                                    {commentError && <div style={{ color: "#b00020", marginBottom: "12px", padding: "8px", backgroundColor: "#ffebee", borderRadius: "4px" }}>{commentError}</div>}
                                    <div style={{ marginBottom: "12px", color: "#495057" }}>Bạn đang bình luận với tư cách: <b>{user?.full_name}</b> ({user?.email})</div>
                                    <div className="form-group">
                                        <label>Nội dung:</label>
                                        <textarea onChange={onChangeInput} name="body" required rows={8} className="form-control" defaultValue={""} value={inputComment.body || ""} />
                                    </div>
                                    <button type="submit" name="sbm" className="btn btn-primary">Gửi</button>
                                </form>
                            )}
                        </div>
                    </div>
                    {/*	End Comment	*/}
                    {/*	Comments List	*/}
                    <div id="comments-list" className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12">
                            {commentsList.map((cmt) => {

                                return (
                                    <div className="comment-item">
                                        <ul>
                                            <li><b>{cmt.name}</b></li>
                                            <li>{moment(cmt.updatedAt).fromNow()}</li>
                                            <li>
                                                <p>{cmt.body}</p>
                                            </li>
                                        </ul>
                                    </div>
                                )
                            })

                            }
                        </div>
                    </div>
                    {/*	End Comments List	*/}
                </div>
                {/*	End Product	*/}
                <div id="pagination">
                    <Pagination pages = {pages}/>
                </div>
            </div>

        </>
    )
}
export default ProductDetails;