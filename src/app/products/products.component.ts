import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState, IProduct } from '../store';
import { REMOVE_PRODUCT, REMOVE_ALL_PRODUCTS, ADD_TO_CART } from '../actions';
import { ProductService } from '../product.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.sass']
})
export class ProductsComponent implements OnInit {
    // @select() products;
    products: IProduct[];
    isLoaded: boolean = false;

    constructor(private ngRedux: NgRedux<IAppState>, private productService: ProductService) { 
        this.productService.getProducts().subscribe(res => {
            console.log(`products.component - products received - ${res}`);
            this.products = res;
            this.isLoaded = true;
        });
    }

    ngOnInit() {
    }
    
    addToCart(product) {
        this.ngRedux.dispatch({type: ADD_TO_CART, payload: {product: product, id: product.id}});
    }

    removeProduct(product) {
        this.ngRedux.dispatch({type: REMOVE_PRODUCT, payload: product.id});
    }

    removeAll() {
        this.ngRedux.dispatch({type: REMOVE_ALL_PRODUCTS});
    }
}
