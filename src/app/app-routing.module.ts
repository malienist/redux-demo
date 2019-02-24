import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products.component';
import { AddProductsComponent } from './add-products/add-products.component';
import { LoggerGuard } from './logger.guard';
import { AddBusinessComponent } from './add-business/add-business.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: ProductsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'addproduct', component: AddProductsComponent, canActivate: [ LoggerGuard ] },
    { path: 'addbusiness', component: AddBusinessComponent, canActivate: [ LoggerGuard ] }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule{

}