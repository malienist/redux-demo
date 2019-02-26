import { ADD_PRODUCT, REMOVE_PRODUCT, REMOVE_ALL_PRODUCTS, ADD_TO_CART, 
    REMOVE_FROM_CART, CLEAR_CART, INCREMENT, DECREMENT, DECREMENT_OK, DECREMENT_FAILED, FETCH_PRODUCTS, RECEIVED_PRODUCTS, RECEIVED_ERROR } from './actions';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { logger } from 'redux-logger';
import axios from 'axios';
import { Injectable } from '@angular/core';

export const store = createStore(rootReducer, applyMiddleware(thunk, logger));

//store change events
store.subscribe(() => console.log('STORE CHANGED', store.getState()));

//interfaces
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
    isFetching: boolean;
    isError: boolean;
}

//intial state
export const INITIAL_STATE: IAppState = {
    products: [],
    cartProducts: [],
    totalAmount: 0,
    isFetching: false,
    isError: false,
};

//action
interface Action {
    type: string;
    payload?: any
}

//root reducer
export function rootReducer(state = INITIAL_STATE, action): IAppState {
    switch(action.type) {
        // case ADD_PRODUCT:
        //     return Object.assign({}, state, {
        //         products: state.products.concat( Object.assign({}, action.payload) )
        //     });
        // case REMOVE_PRODUCT:
        //     return Object.assign({}, state, {
        //         products: state.products.filter(t => t.id !== action.payload)
        //     });
        // case REMOVE_ALL_PRODUCTS:
        //     return Object.assign({}, state, {
        //         products: []
        //     });
        // case ADD_TO_CART:
        //     //for items with more than 1 quantity
        //     let duplicateItem = state.cartProducts.filter(item => item.id === action.payload.id);
        //     let duplicateIndex;
        //     if(duplicateItem.length) {
        //         console.log('if');
        //         for(var i = 0; i <= state.cartProducts.length - 1; i++){
        //             if(state.cartProducts[i].id === duplicateItem[0].id){
        //                 duplicateIndex = i;   
        //             }
        //         }
        //         let newCart = {...state};
        //         //incrementing quantity of item
        //         newCart.cartProducts[duplicateIndex].quantity = newCart.cartProducts[duplicateIndex].quantity === undefined ? 2 : newCart.cartProducts[duplicateIndex].quantity + 1;
        //         return calculateCartTotal(state);
        //     }
        //     //for items with single quantity
        //     state.cartProducts = state.cartProducts.concat( Object.assign({}, action.payload.product ) );
        //     console.log(`quantity - ${state.cartProducts[0].name}`);
        //     return calculateCartTotal(state);
        // case REMOVE_FROM_CART:
        //     state.cartProducts = state.cartProducts.filter(item => item.id !== action.payload);
        //     return calculateCartTotal(state);
        // case CLEAR_CART:
        //     return Object.assign({}, state, {
        //        cartProducts: [] 
        //     });
        // case DECREMENT:
        //     return decrementItem(state, action.payload);
        // case INCREMENT:
        //     console.log(`increment-${action.payload}`);
        //     return incrementItem(state, action.payload);
        case FETCH_PRODUCTS:
            console.log(`loading initial state - ${JSON.stringify(state)}`);
            return Object.assign({}, state, {
                isFetching: true
            });
        case RECEIVED_PRODUCTS:
            console.log(`received products[] - ${JSON.stringify(action.payload.products)}`);
            return Object.assign({}, state, {
                products: action.payload.products,
                isFetching: false,
            });
        case RECEIVED_ERROR:
            return Object.assign({}, state, {
                isError: true,
                isFetching: false
            });
        case DECREMENT:
            return Object.assign({}, state, {
                isFetching: true
            });
        case DECREMENT_OK:
            return Object.assign({}, state, {
                products: state.products.filter(item => item.id !== action.payload),
                isFetching: false
            });
        case DECREMENT_FAILED:
            return Object.assign({}, state, {
                isError: true
            });
    }
    // console.log(`products in current state - ${state}`);
    return state;
}

//action creators
export const fetchProducts = () => {
    return {
        type: FETCH_PRODUCTS,
    }
}
export const receivedProducts = (data) => {
    return {
        type: RECEIVED_PRODUCTS,
        payload: {
            products: data,
            isFetching: false
        }
    }
}
export const receivedError = () => {
    return {
        type: RECEIVED_ERROR
    }
}
export const removeProduct = (productId) => {
    return {
        type: REMOVE_PRODUCT,
        payload: productId
    }
}
export const decrement = (id) => {
    return {
        type: DECREMENT,
        payload: id,
        isFetching: true
    }
}
export const decrementSuccess = (id) => {
    return {
        type: DECREMENT_OK,
        payload: id
    }
}
export const decrementFailed = (id) => {
    return {
        type: DECREMENT_FAILED,
        isError: true
    }
}

// thunk actions
@Injectable({
    providedIn: 'root'
})
export class ThunkClass {
    //load initial state
    loadInitialState() {
        store.dispatch(fetchProducts());
        return (dispatch) => {
            axios.get(`http://localhost:4000/products/getproducts`)
            .then(res => {
                // console.log(`fetch action - response received - ${JSON.stringify(data)}`);
                if(!res) console.log(`fetch errored`);
                else {
                    console.log(`thunk action - fetched result - ${res}`);
                    dispatch(receivedProducts(res.data));
                }
            })
            .catch(err => {
                dispatch(receivedError());
                console.log(`thunk action - error fetching products - ${err}`);
            });
        }
    } 
    // decrement product
    decrementItem(prodId) {
        console.log(`decrement id - ${prodId}`);
        store.dispatch(decrement(prodId));
        return (dispatch) => {
            axios.delete(`http://localhost:4000/products/deleteproduct`, {params: {
                id: prodId
            }})
            .then(data => {
                console.log(`decrement thunk received data - ${data}`);
                if(!data) console.log(`decrement failed`);
                else {
                    console.log(`thunk action - decreased product quantity - ${data}`);
                    dispatch(decrementSuccess(prodId));
                }
            })
            .catch(err => {
                console.log(`decrement thunk caught error - ${err}`);
                dispatch(decrementFailed(prodId));
            });
        }
    }
}    

//decrement item in cart
function decrementItem(oldState, id): IAppState {
    let newState = {...oldState};
    let decreasedProduct = newState.cartProducts.filter(item => item.id === id);
    let _quantity = parseInt(decreasedProduct[0].quantity);
    decreasedProduct[0].quantity =  _quantity === 0 ? 0 : (_quantity - 1);
    return calculateCartTotal(newState);
}
//increment item in cart
function incrementItem(oldState, id): IAppState {
    let newState = {...oldState};
    let increasedItem = newState.cartProducts.filter(t => t.id === id);
    console.log(`increment quantity - ${increasedItem[0].quantity}`);
    increasedItem[0].quantity = parseInt(increasedItem[0].quantity) + 1;
    return calculateCartTotal(newState);
}

//get total amount of items in cart
function calculateCartTotal(oldState): IAppState {
    let newState = {...oldState};
    console.log(`newstate cartproducts - ${newState.cartProducts[0].name}`);
    let singleItems = newState.cartProducts.filter(item => item.quantity === "1");
    let multipleItems = newState.cartProducts.filter(item => parseInt(item.quantity) > 1);
    console.log(`single-${singleItems}, multi-${multipleItems}`);
    let singleItemAmount = 0, multipleItemAmount = 0;
    for(var i = 0; i < singleItems.length; i++){
        singleItemAmount += +singleItems[i].price;
    }
    for(var i = 0; i < multipleItems.length; i++){
        multipleItemAmount += multipleItems[i].price * multipleItems[i].quantity;
    }
    console.log(`single amount - ${singleItemAmount}, multiple amout - ${multipleItemAmount}`);
    newState.totalAmount = singleItemAmount + multipleItemAmount;
    return newState;
}
