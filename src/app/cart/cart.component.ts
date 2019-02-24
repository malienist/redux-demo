import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../store';
import { REMOVE_FROM_CART, CLEAR_CART, INCREMENT, DECREMENT } from '../actions';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.sass']
})
export class CartComponent implements OnInit {
    @select() cartProducts;
    @select() totalAmount;
    cartAmount: number;

    constructor(private ngRedux: NgRedux<IAppState>) { }

    ngOnInit() {
        this.cartAmount = this.totalAmount;
    }
    
    removeFromCart(product) {
        this.ngRedux.dispatch({type: REMOVE_FROM_CART, payload: product.id});
    }
    
    decrement(product) {
        this.ngRedux.dispatch({type: DECREMENT, payload: product.id});
    }

    increment(product) {
        this.ngRedux.dispatch({type: INCREMENT, payload: product.id});
    }

    clearCart() {
        this.ngRedux.dispatch({type: CLEAR_CART});
    }
}
