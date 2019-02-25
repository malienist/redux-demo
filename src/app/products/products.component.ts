import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState, ThunkClass } from '../store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.sass']
})
export class ProductsComponent implements OnInit {
    @select() products;
    @select() isFetching;
    thunk: any;

    constructor(private ngRedux: NgRedux<IAppState>) { 
        this.thunk = new ThunkClass();
    }

    ngOnInit() {
        this.ngRedux.dispatch(this.thunk.loadInitialState());
    }
    
    // addToCart(product) {
    //     this.ngRedux.dispatch({type: ADD_TO_CART, payload: {product: product, id: product.id}});
    // }

    // removeProduct(product) {
    //     this.ngRedux.dispatch({type: REMOVE_PRODUCT, payload: product.id});
    // }

    // removeAll() {
    //     this.ngRedux.dispatch({type: REMOVE_ALL_PRODUCTS});
    // }
}
