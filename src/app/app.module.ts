import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { FormsModule } from '@angular/forms';
import { IAppState, INITIAL_STATE, rootReducer } from './store';

import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import { AddProductsComponent } from './add-products/add-products.component';
import { CartComponent } from './cart/cart.component';

@NgModule({
    declarations: [
        AppComponent,
        ProductsComponent,
        AddProductsComponent,
        CartComponent,
    ],
    imports: [
        BrowserModule,
        NgReduxModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { 
    constructor(ngRedux: NgRedux<IAppState>){
        ngRedux.configureStore(rootReducer, INITIAL_STATE);
    }
}
