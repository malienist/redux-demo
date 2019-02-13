import { ADD_PRODUCT, REMOVE_PRODUCT, REMOVE_ALL_PRODUCTS, ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from './actions';

export interface IProduct {
    id: string;
    name: string;
    price: string;
    category: string;
    quantity?: number;
}
export interface IAppState {
    products: IProduct[];
    cartProducts: IProduct[];
    totalAmount: number;
}
export const INITIAL_STATE: IAppState = {
    products: [
        {id: '12', name: 'Nike', price: '500', category: 'shoes'},
        {id: '13', name: 'Adidas', price: '1000', category: 'high tops'},
        {id: '14', name: 'Puma', price: '2000', category: 'sneakers'},
        {id: '15', name: 'Reebok', price: '500', category: 'yeezy'}
    ],
    cartProducts: [],
    totalAmount: 0
};
interface Action {
    type: string;
    payload?: any
}

//get total amount of items in cart
function calculateCartTotal(state): IAppState {
    let newCart = {...state};
    let singleItems = newCart.cartProducts.filter(item => item.quantity === undefined || item.quantity === 1);
    let multipleItems = newCart.cartProducts.filter(item => item.quantity > 1);
    let singleItemAmount = 0, multipleItemAmount = 0;
    for(var i = 0; i < singleItems.length; i++){
        singleItemAmount += +singleItems[i].price;
    }
    for(var i = 0; i < multipleItems.length; i++){
        multipleItemAmount += multipleItems[i].price * multipleItems[i].quantity;
    }
    // console.log(`single amount - ${singleItemAmount}, multiple amout - ${multipleItemAmount}`);
    newCart.totalAmount = singleItemAmount + multipleItemAmount;
    return newCart;
}

export function rootReducer(state, action): IAppState {
    switch(action.type) {
        case ADD_PRODUCT:
            return Object.assign({}, state, {
                products: state.products.concat( Object.assign({}, action.payload) )
            });
        case REMOVE_PRODUCT:
            return Object.assign({}, state, {
                products: state.products.filter(t => t.id !== action.payload)
            });
        case REMOVE_ALL_PRODUCTS:
            return Object.assign({}, state, {
                products: []
            });
        case ADD_TO_CART:
            //for items with more than 1 quantity
            let duplicateItem = state.cartProducts.filter(item => item.id === action.payload.id);
            let duplicateIndex;
            if(duplicateItem.length) {
                for(var i = 0; i <= state.cartProducts.length - 1; i++){
                    if(state.cartProducts[i].id === duplicateItem[0].id){
                        duplicateIndex = i;   
                    }
                }
                let newCart = {...state};
                //incrementing quantity of item
                newCart.cartProducts[duplicateIndex].quantity = newCart.cartProducts[duplicateIndex].quantity === undefined ? 2 : newCart.cartProducts[duplicateIndex].quantity + 1;
                return calculateCartTotal(state);
            }
            //for items with single quantity
            state.cartProducts = state.cartProducts.concat( Object.assign({}, action.payload.product ) );
            return calculateCartTotal(state);
        case REMOVE_FROM_CART:
            state.cartProducts = state.cartProducts.filter(item => item.id !== action.payload);
            return calculateCartTotal(state);
        case CLEAR_CART:
            return Object.assign({}, state, {
               cartProducts: [] 
            });
    }
    return state;
}
