import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {Router} from '@angular/router';

import {FuseConfigService} from '@fuse/services/config.service';
import {fuseAnimations} from '@fuse/animations';

import {ApiAuthService} from 'app/services/auth.service';
import {ApiTokenService} from 'app/services/token.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import {TranslateService} from '@ngx-translate/core';
import { User } from '../../../api';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    errorMsg = null;
    logoUrl = '';
    favoriteSeason = '';
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _formBuilder: FormBuilder,
        public router: Router,
        public auth: ApiAuthService,
        public token: ApiTokenService,
        private translate: TranslateService,
    ) {
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
        this.logoUrl = auth.getLogoUrl();
    }

    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
        this.loginForm.valueChanges.subscribe( (data) => {
            this.errorMsg = null;
        });
    }

    onSubmit(): void {
        const user = {
            mail: this.loginForm.value['email'],
            password: this.loginForm.value['password']
        } as User;
        this.auth.authenticate(user).subscribe(
            data => this.handleResponse(data),
            e => {
                console.log(e);
                if (e.status === 401) {
                    this.errorMsg = this.translate.instant('LOGIN.WRONG_CREDENTIALS');

                } else if (e.status === 403) {
                    this.errorMsg = this.translate.instant('LOGIN.SURVEY_MISSING');
                } else {
                    console.error(e);
                }
            });
    }
    handleResponse(data): void {
        console.log(data);
        this.token.handle(data);
        this.auth.changeAuthStatus(true);
        this.auth.userProfileGet(data['uid']).subscribe(Tdata => {
            this.token.setUser(Tdata);
        }, error => {
            this.auth.logout();
        });
        this.router.navigate([`tabs/${data['uid']}`]);
    }
    dummyUser(num: number): void {
        this.loginForm.controls['email'].setValue('test' + num.toString() + '@dummy.com');
        this.loginForm.controls['password'].setValue('12TestDumm!89');
        // this.login(false);
    }

}
