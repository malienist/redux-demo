import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface BusinessModel {
    person_name: string;
    business_name: string;
    business_gst_number: number;
}

@Injectable({
    providedIn: 'root'
})
export class BusinessService {
    uri = 'http://localhost:4000/business';

    constructor(private http: HttpClient) { }

    addBusiness(person_name, business_name, business_gst_number){
        const obj = {
            person_name: person_name,
            business_name: business_name,
            business_gst_number: business_gst_number
        };
        this.http.post(`${this.uri}/add`, obj)
        .subscribe(res => console.log('business sent from service'));
    }
}
