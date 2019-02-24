import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthorizeService {

    constructor(private router: Router) { }

    login(username: string, password: string): boolean{
        if(username === 'safal' && password === '123') {
            localStorage.setItem('user', username);
            return true;
        }
        return false;
    }

    logout() {
        localStorage.removeItem('user');
        this.router.navigate(['/home']);
    }

    // isLoggedIn(): boolean{
    //     return this.getUser() ? true : false;
    // }

    getUser(): any {
        return localStorage.getItem('user');
    }
}
