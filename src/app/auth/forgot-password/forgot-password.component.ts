import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '@fuse/animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FuseConfigService} from '@fuse/services/config.service';
import {ApiAuthService} from 'app/services/auth.service';
import {FuseConfirmDialogComponent} from '@fuse/components/confirm-dialog/confirm-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';

import {
    MatSnackBar,
    MatSnackBarConfig,   
  } from '@angular/material';
import {HttpResponse} from "@angular/common/http";
import {Router} from "@angular/router";
@Component({
    selector: 'forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ForgotPasswordComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    forgotPasswordForm: FormGroup;
    snackConfig:any;
    logoUrl = "";
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private auth: ApiAuthService,
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
        public translate:TranslateService,
        public router: Router,
    ) {
        // Configure the layout
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
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
        this.snackConfig = new MatSnackBarConfig();
        this.snackConfig.verticalPosition = "top";
        this.snackConfig.horizontalPosition = "center";
        this.snackConfig.duration = 3000;
    }

    onSubmit() {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.messageTxt = this.translate.instant('RESET_PASSWORD.BEFORE_RESET_MSG');
        this.confirmDialogRef.componentInstance.headerTxt = this.translate.instant('RESET_PASSWORD.TITLE');
        this.confirmDialogRef.componentInstance.yesButtonTxt = this.translate.instant('GENERAL.YES_BTN');
        this.confirmDialogRef.componentInstance.noButtonTxt = this.translate.instant('GENERAL.NO_BTN')
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result ) {
                this.auth.userPasswordGet(this.forgotPasswordForm.value['email'])
                    .subscribe(async (response: HttpResponse<string>) => {
                            // if (response.ok) {
                                await this.router.navigateByUrl(`login`);
                            // }
                        },
                        async (error1: HttpErrorResponse) => {
                            if (error1.status === 400) {
                                this.snackBar.open(this.translate.instant('RESET_PASSWORD.USER_NOT_EXISTS', {
                                    mail: this.forgotPasswordForm.value['email']
                                }), "Error", this.snackConfig);

                                this.forgotPasswordForm.setValue({email:''});
                            } else {

                            }
                        });
            }
            this.confirmDialogRef = null;
        });

        // this.auth.sendPasswordResetLink(this.forgotPasswordForm.value).subscribe(
        //     (data:any) => {
        //         this.handleResponse(data);
        //         this.snackBar.open(data.data, "Success", this.snackConfig);
        //     },
        //     (error:any) => {
        //         this.snackBar.open(error.error.data,'Error',this.snackConfig);
        //     }
        // );
    }

    handleResponse (res) {        
        // this.forgotPasswordForm = this._formBuilder.group({
        //     email: ['', [Validators.required, Validators.email]]
        // });
    }

}
