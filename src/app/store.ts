import { ADD_PRODUCT, REMOVE_PRODUCT, REMOVE_ALL_PRODUCTS, ADD_TO_CART, 
    REMOVE_FROM_CART, CLEAR_CART, INCREMENT, DECREMENT, DECREMENT_OK, DECREMENT_FAILED, FETCH_PRODUCTS, RECEIVED_PRODUCTS, RECEIVED_ERROR, DECREASE_QUANTITY } from './actions';
import axios from 'axios';
import { Injectable } from '@angular/core';
import { Store, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';


export const store: Store<IAppState> = createStore(rootReducer, applyMiddleware(thunk, createLogger({collapsed: true})));

//store change events
// store.subscribe(() => console.log('STORE CHANGED', store.getState()));

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
            // console.log(`loading initial state`);
            return Object.assign({}, state, {
                isFetching: true
            });
        case RECEIVED_PRODUCTS:
            // console.log(`received products`);
            return Object.assign({}, state, {
                products: state.products.concat(action.payload),
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
            console.log(`DECREMENT_OK`);
            return Object.assign({}, state, {
                products: state.products.filter(item => item.id !== action.payload),
                isFetching: false
            });
        case DECREMENT_FAILED:
            return Object.assign({}, state, {
                isError: true,
                isFetching: false
            });
        case DECREASE_QUANTITY:
            let _newState = {...state};
            _newState.isFetching = false;
            let index = _newState.products.findIndex(item => item.id === action.payload);
            // console.log(`REDUCER - QUANTITY - ${_newState.products[index].quantity}`);
            _newState.products[index].quantity = _newState.products[index].quantity - 1;
            return _newState;
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
        payload: data
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
        payload: id
    }
}
export const decrementSuccess = (id) => {
    return {
        type: DECREMENT_OK,
        payload: id
    }
}
export const decreaseQuantity = (id) => {
    return {
        type: DECREASE_QUANTITY,
        payload: id
    }
}
export const decrementFailed = (id) => {
    return {
        type: DECREMENT_FAILED,
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
                    // console.log(`thunk action - fetched result - ${res}`);
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
    decrementItem(product) {
        // console.log(`decrement id - ${product.id}, product quantity - ${product.quantity}`);
        store.dispatch(decrement(product.id));
        if(product.quantity === 1 || product.quantity === "1") {
            console.log(`DELETION`);
            return (dispatch) => {
                axios.delete(`http://localhost:4000/products/deleteproduct`, {params: {
                    id: product.id
                }})
                .then(data => {
                    console.log(`decrement thunk received data - ${data}`);
                    if(!data) console.log(`decrement failed`);
                    else {
                        console.log(`thunk action - decreased product quantity - ${data}`);
                        store.dispatch(dispatch(decrementSuccess(product.id)));
                    }
                })
                .catch(err => {
                    console.log(`decrement thunk caught error - ${err}`);
                    store.dispatch(dispatch(decrementFailed(product.id)));
                });
            }
        } else {
            // console.log(`UPDATION QUANTITY - ${product.quantity}`);
            return (dispatch) => {
                setTimeout(() => {
                    axios.put(`http://localhost:4000/products/updatequantity?id=${product.id}&quantity=${product.quantity}`)
                    .then(data => {
                        if(!data) console.log(`decrement failed #2`);
                        else {
                            // console.log(`thunk action - decreased product quantity #2 - ${data}`);
                            dispatch(decreaseQuantity(product.id));
                        }
                    })
                    .catch(err => {
                        console.log(`decrement thunk caught error #2 - ${err}`);
                        dispatch(decrementFailed(product.id));
                    });
                }, 2500);
            }
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
