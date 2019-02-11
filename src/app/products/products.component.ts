import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../store';
import { REMOVE_PRODUCT, REMOVE_ALL_PRODUCTS } from '../actions';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.sass']
})
export class ProductsComponent implements OnInit {
    @select() products;

    constructor(private ngRedux: NgRedux<IAppState>) { }

    ngOnInit() {
    }

    removeProduct(product) {
        this.ngRedux.dispatch({type: REMOVE_PRODUCT, id: product.id});
    }

    removeAll() {
        this.ngRedux.dispatch({type: REMOVE_ALL_PRODUCTS});
    }
}
