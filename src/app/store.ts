import { ADD_PRODUCT, REMOVE_PRODUCT, REMOVE_ALL_PRODUCTS } from './actions';

export interface IProduct {
    id: string;
    name: string;
    price: string;
    category: string;
}
export interface IAppState {
    products: IProduct[];
}
interface Action {
    type: string;
    payload?: any
}
export function rootReducer(state, action): IAppState {
    switch(action.type) {
        case ADD_PRODUCT:
            console.log(`product added in store state - ${state}, action - ${action}`);
            return Object.assign({}, state, {
                products: state.products.concat( Object.assign({}, action.product) )
            });
        case REMOVE_PRODUCT:
            return Object.assign({}, state, {
                products: state.products.filter(t => t.id !== action.id)
            });
        case REMOVE_ALL_PRODUCTS:
            return Object.assign({}, state, {
                products: []
            });
    }
    return state;
}
export const INITIAL_STATE: IAppState = {
    products: [
        {id: '12', name: 'Nike', price: '5999', category: 'shoes'}
    ]
};