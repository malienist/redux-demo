import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState, ThunkClass, IProduct } from '../store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.sass']
})
export class ProductsComponent implements OnInit {
    @select() products;
    @select() isFetching;

    constructor(private ngRedux: NgRedux<IAppState>, private _thunk: ThunkClass) { 
    }

    ngOnInit() {
        this.ngRedux.dispatch<any>(this._thunk.loadInitialState());
    }

    decrement(product: IProduct) {
        // console.log(`product mongo _id - ${product}`);
        this.ngRedux.dispatch<any>(this._thunk.decrementItem(product));
    }

    // removeProduct(productId) {
    //     this.ngRedux.dispatch(this._thunk.removeProduct(productId));
    // }
}
