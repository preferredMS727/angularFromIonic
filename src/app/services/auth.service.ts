import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {User} from '../../api';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ApiTokenService} from './token.service';
import * as Constants from '../app.const';
import {Router, NavigationExtras, Params} from '@angular/router';
import {Token} from '../../api';
import {sha512} from 'js-sha512';
import {CustomHttpUrlEncodingCodec} from '../../api/encoder';
import {DefaultService} from '../../api';
// import { ModalController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})

export class ApiAuthService {

    private intervalId: any;
    private refreshCycle = 120 * 60 * 1000;

    constructor(
        private http: HttpClient,
        private token: ApiTokenService,
        public router: Router,
        private api: DefaultService,
        // private modalController: ModalController
        ) {
    }
    public defaultHeaders = new HttpHeaders();
    private loggedIn = new BehaviorSubject < boolean > (this.token.loggedIn());

    authStatus = this.loggedIn.asObservable();

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    public async getUserId(): Promise<number> {
        console.log('Fetch Access Token for api access.');
        return Number(localStorage.getItem('uid'));
    }

    changeAuthStatus(value: boolean): void {
        this.loggedIn.next(value);
    }

    public authenticate(user: User): any {
        let headers = this.defaultHeaders;

        // authentication (basicAuth) required
        const username = user.mail.toLowerCase() === undefined ? '' : user.mail.toLowerCase();
        const password = sha512(user.password === undefined ? '' : user.password);
        if (username || password) {
            headers = headers.set('Authorization', 'Basic ' + btoa(username + ':' + password));
        }

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];

        return this.http.get<Token>(`${Constants.API_URL}/oauth2/auth`,
            {
                headers: headers,
            }
        );

    }
    public logout(): void {
        this.token.remove();
        this.changeAuthStatus(false);
        this.router.navigate(['/auth/login']);
    }
    public register(user: User): any {
        let headers = this.defaultHeaders;

        const httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.http.post<User>(`${Constants.API_URL}/users`,
            user,
            {
                headers: headers,
            }
        );

    }
    public userPasswordGet(mail: string): any {
        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (mail !== undefined && mail !== null) {
            queryParameters = queryParameters.set('mail',  mail as any);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];

        return this.http.get<any>(`${Constants.API_URL}/users/reset_password`,
            {
                params: queryParameters,
                headers: headers,
            }
        );
    }

    public userProfileGet(userId: number, observe: any = 'body', reportProgress: boolean = false ): any {

        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling usersUserIdGet.');
        }

        let headers = this.defaultHeaders;

        // authentication (oauth2) required
        if (this.token.get()) {
            headers = headers.set('Authorization', 'Bearer ' + this.token.get());
        }

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];

        return this.http.get<User>(`${Constants.API_URL}/users/${encodeURIComponent(String(userId))}`,
            {
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }



    public changePassword(user): any {
        return this.http
            .post(Constants.API_URL + '/api/changePassword', user, this.httpOptions)
            .pipe(
                map((response: Response) => response)
            );
    }
    private jwt(): any {
        if (this.token.get()) {
            const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
            return {headers: headers};
        }
    }
    public getLogoUrl(): any {
        return 'assets/icons/icon.png';
    }
    public selectHeaderAccept(accepts: string[]): string | undefined {
        if (accepts.length === 0) {
            return undefined;
        }

        const type = accepts.find(x => this.isJsonMime(x));
        if (type === undefined) {
            return accepts[0];
        }
        return type;
    }
    public isJsonMime(mime: string): boolean {
        const jsonMime: RegExp = new RegExp('^(application\/json|[^;/ \t]+\/[^;/ \t]+[+]json)[ \t]*(;.*)?$', 'i');
        return mime != null && (jsonMime.test(mime) || mime.toLowerCase() === 'application/json-patch+json');
    }
    public selectHeaderContentType(contentTypes: string[]): string | undefined {
        if (contentTypes.length === 0) {
            return undefined;
        }

        const type = contentTypes.find(x => this.isJsonMime(x));
        if (type === undefined) {
            return contentTypes[0];
        }
        return type;
    }

    public async refreshToken(): Promise<void> {
        this.api.configuration.accessToken = await this.token.get();
        this.api.configuration.withCredentials = true;
        try {
            const response = await this.api.oauth2RefreshGet('response').toPromise();
            if (response.ok) {
                this.api.configuration.accessToken = response.body;
                await this.token.set(response.body);
                clearTimeout(this.intervalId);
                this.intervalId = setTimeout(this.refreshToken.bind(this), this.refreshCycle);
            }
        } catch (e) {
            await localStorage.removeItem('accessToken');
            await localStorage.removeItem('userId');
            if (this.intervalId !== undefined) {
                clearTimeout(this.intervalId);
            }
            // while (await this.modalController.getTop() !== undefined) {
            //     await this.modalController.dismiss();
            // }
            await this.router.navigate(['/auth/login'], {
                queryParams: {
                    timeout: '1'
                } as Params
            } as NavigationExtras);
            console.error(e);
        }
    }
}
