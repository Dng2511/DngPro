import { currencyType } from "../constants/currency-type";
import { getImgProduct } from "../ultils";
import { Link } from "react-router-dom";
const ProductItem = ({item}) => {
    
    return (
        <div className="text-center product-item card ">

            <Link to={`/products/${item._id}`}><img src={getImgProduct(item.thumbnail)} alt="" />
            <h4>{item.name}</h4>
            <p>Giá Bán: <span>{currencyType(item.price)}</span></p>
            </Link>
        </div>
    )
}
export default ProductItem;