import {Injectable} from '@angular/core';
import {User} from '../models/user';
import {Subject} from 'rxjs';
import {DefaultService} from '../../api';

@Injectable({
    providedIn: 'root'
})
export class ApiTokenService {

    user?: User = null;
    private syncUidSubject = new Subject<any>();

    private intervalId: any;
    private refreshCycle = 5 * 60 * 1000;

    constructor(
        private api: DefaultService,
    ) {

    }

    public handle(data): void {
        this.set(data['token']);
        this.setUid(data['uid']);
        this.setUser(data['uid']);
        // this.setEnrichCredits(data['validEnrichCredits']);
    }
    public setUser(data): any {
       localStorage.setItem('user', JSON.stringify(data));
    }
    public getUser(): any{
        return JSON.parse(localStorage.getItem('user'));
    }
    public set(token): void{
        localStorage.setItem('token', token);
    }

    public get(): any{
        return localStorage.getItem('token');
    }

    public setUid(uid): void{
        localStorage.setItem('uid', uid);
        this.syncUidSubject.next(uid);
    }

    // public setEnrichCredits(credits){
    //     localStorage.setItem("validEnrichCredits",credits);
    // }
    // public getEnrichCredits(): any{
    //     if (localStorage.getItem('validEnrichCredits')) {
    //         return Number(localStorage.getItem('validEnrichCredits'));
    //     } else {
    //         return 0;
    //     }
    //
    // }

    public getUid(): any{
        if (localStorage.getItem('uid')) {
            return localStorage.getItem('uid');
        } else {
            return null;
        }

    }

    syncUid(): any{
        return this.syncUidSubject.asObservable();
    }

    public remove(): void{
        localStorage.removeItem('token');
        localStorage.removeItem('uid');
    }

    // private isValid(): any{
    //     const token = this.get();
    //     if (this.get()) {
    //         const payload = this.payload(token);
    //         if (payload) {
    //             return true;
    //         }
    //     }
    // }
    //
    // private payload(token) {
    //     // const payload = token.split('.')[1];
    //     const  payload = token;
    //     return this.decode(payload);
    // }
    //
    // private decode(payload) {
    //     console.log(payload);
    //     return JSON.parse(atob(payload));
    // }

    public loggedIn(): boolean {
        if (this.get()) { return true; }
        else { return false; }
        // return this.isValid();
    }
}
