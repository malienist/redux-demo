import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BusinessService } from '../business.service';

@Component({
    selector: 'app-add-business',
    templateUrl: './add-business.component.html',
    styleUrls: ['./add-business.component.sass']
})
export class AddBusinessComponent implements OnInit {
    @ViewChild('bform') addbusinessform: NgForm;
    constructor(private bs: BusinessService) { }

    ngOnInit() {
    }
    
    onSubmit(form: any) {
        console.log(`form values - ${form.personname}, ${form.businessname}, ${form.businessgst}`);
        this.bs.addBusiness(form.personname, form.businessname, form.businessgst);
        this.addbusinessform.reset();
    }
}
