import { Component, OnInit, ViewChild } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState, IProduct } from '../store';
import { ADD_PRODUCT } from '../actions';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-add-products',
    templateUrl: './add-products.component.html',
    styleUrls: ['./add-products.component.sass']
})
export class AddProductsComponent implements OnInit {
    @select() products;
    @ViewChild('prodForm') prodForm: NgForm;

    model: IProduct = {
        id: '',
        name: '',
        price: '',
        category: '',
        quantity: 0
    };

    constructor(private ngRedux: NgRedux<IAppState>) { }

    ngOnInit() {
    }
    
    onSubmit(): void {
        console.log('product added');
        this.ngRedux.dispatch({type: ADD_PRODUCT, payload: this.model});
        this.prodForm.reset();
    }
}
