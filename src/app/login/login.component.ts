import { Component, OnInit } from '@angular/core';
import { AuthorizeService } from '../authorize.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
    loggedIn: boolean;

    constructor(private authService: AuthorizeService, private router: Router) { }

    ngOnInit() {
        this.loggedIn = this.authService.getUser();
    }

    onSubmit(username: string, password: string) {
        if(this.authService.login(username, password)){
            this.router.navigate(['/addproduct']);
        } else {
            alert('login failed');
        }
        // console.log(`form - ${username}, ${password}`);
    }

    logout() {
        this.authService.logout();
    }
}
