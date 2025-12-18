import { ADD_TO_CART, DELETE_CART, UPDATE_CART, SET_CART } from "../../shared/constants/action-type";

const getInitialState = () => {
    try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            return JSON.parse(savedCart);
        }
    } catch (error) {
        console.error("Error loading cart from localStorage:", error);
    }
    return { items: [] };
};

const initState = getInitialState();


const addToCart = (state, payload) => {
    const items = state.items;
    let isProductExist = false;
    items.map((item)=>{
        if(item._id === payload._id){
            item.qty+=payload.qty;
            isProductExist = true;
        }
        return item;
    })
    const newItem = isProductExist?items:[...items, payload];
    return {...state, items: newItem}
}

const updateCart = (state, payload) => {
    const items = state.items;
    const newItems = items.map((item)=>{
        if (item._id === payload._id) item.qty = payload.qty;
        return item;
    })
    
    return {...state, items: newItems};
}

const deleteCart = (state, payload) => {
    const items = state.items;
    const newItems = items.filter((item) =>{
        if (item._id === payload._id) return false;
        return true;
    })
    return {...state, items: newItems};
}

const setCart = (state, payload) => {
    return {...state, items: payload};
}


export default (state=initState, action) => {
    let newState;
    switch(action.type){
        case ADD_TO_CART: 
            newState = addToCart(state, action.payload);
            break;
        case UPDATE_CART: 
            newState = updateCart(state, action.payload);
            break;
        case DELETE_CART: 
            newState = deleteCart(state, action.payload);
            break;
        case SET_CART: 
            newState = setCart(state, action.payload);
            break;
        default: 
            return state;
    }
    
    // Save cart to localStorage after state changes
    try {
        localStorage.setItem("cart", JSON.stringify(newState));
    } catch (error) {
        console.error("Error saving cart to localStorage:", error);
    }
    
    return newState;
}