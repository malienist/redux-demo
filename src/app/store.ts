import { ADD_PRODUCT, REMOVE_PRODUCT, REMOVE_ALL_PRODUCTS, ADD_TO_CART, 
    REMOVE_FROM_CART, CLEAR_CART, INCREMENT, DECREMENT } from './actions';

export interface IProduct {
    productId: number;
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
    products: [],
    cartProducts: [],
    totalAmount: 0
};
interface Action {
    type: string;
    payload?: any
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
        case DECREMENT:
            return decrementItem(state, action.payload);
        case INCREMENT:
            return incrementItem(state, action.payload);
    }
    return state;
}

//decrement item in cart
function decrementItem(oldState, id): IAppState {
    let newState = {...oldState};
    let decreasedProduct = newState.cartProducts.filter(item => item.id === id);
    decreasedProduct[0].quantity = decreasedProduct[0].quantity <= 0 || decreasedProduct[0].quantity === undefined ? 0 : decreasedProduct[0].quantity - 1;
    return calculateCartTotal(newState);
}
//increment item in cart
function incrementItem(oldState, id): IAppState {
    let newState = {...oldState};
    let increasedItem = newState.cartProducts.filter(t => t.id === id);
    increasedItem[0].quantity = increasedItem[0].quantity === undefined ? 2 : increasedItem[0].quantity + 1;
    return calculateCartTotal(newState);
}

//get total amount of items in cart
function calculateCartTotal(oldState): IAppState {
    let newState = {...oldState};
    let singleItems = newState.cartProducts.filter(item => item.quantity === undefined || item.quantity === 1);
    let multipleItems = newState.cartProducts.filter(item => item.quantity > 1);
    let singleItemAmount = 0, multipleItemAmount = 0;
    for(var i = 0; i < singleItems.length; i++){
        singleItemAmount += +singleItems[i].price;
    }
    for(var i = 0; i < multipleItems.length; i++){
        multipleItemAmount += multipleItems[i].price * multipleItems[i].quantity;
    }
    // console.log(`single amount - ${singleItemAmount}, multiple amout - ${multipleItemAmount}`);
    newState.totalAmount = singleItemAmount + multipleItemAmount;
    return newState;
}