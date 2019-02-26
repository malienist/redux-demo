import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
//routing
import { AppRoutingModule } from './app-routing.module';
//redux + redux thunk
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import thunk from 'redux-thunk';
//store
import { IAppState, INITIAL_STATE, rootReducer, ThunkClass } from './store';
//services
import { AuthorizeService } from './authorize.service';
import { BusinessService } from './business.service';
//guards
import { LoggerGuard } from './logger.guard';
import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import { AddProductsComponent } from './add-products/add-products.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { AddBusinessComponent } from './add-business/add-business.component';
import { ProductService } from './product.service';

@NgModule({
    declarations: [
        AppComponent,
        ProductsComponent,
        AddProductsComponent,
        CartComponent,
        LoginComponent,
        AddBusinessComponent,
    ],
    imports: [
        BrowserModule,
        NgReduxModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [
        AuthorizeService,
        LoggerGuard,
        BusinessService,
        ProductService,
        ThunkClass
    ],
    bootstrap: [AppComponent]
})
export class AppModule { 
    constructor(ngRedux: NgRedux<IAppState>){
        ngRedux.configureStore(rootReducer, INITIAL_STATE, [thunk], []);
    }
}
