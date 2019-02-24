import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    static API_URL = 'http://localhost:4000/products';

    constructor(private http: HttpClient) { }

    getProducts(): Observable<any> {
        return this.http.get(`${ProductService.API_URL}/getproducts`).pipe(
            map(res => {
                console.log(`product.service.getProducts() - ${res}`);
                return res;
            })
        )
    }
}
