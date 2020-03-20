import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { ApiAuthService } from 'app/services/auth.service';
// import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { OkDialogComponent } from "../../../@fuse/components/ok-dialog/ok-dialog.component";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../../api';

import {
    MatSnackBar,
    MatSnackBarConfig,   
  } from '@angular/material';
import {HttpResponse} from "@angular/common/http";
import {Router} from "@angular/router";
@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RegisterComponent implements OnInit {
    // confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    okDialogRef: MatDialogRef<OkDialogComponent>;
    registerForm: FormGroup;
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
        this.registerForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
        this.snackConfig = new MatSnackBarConfig();
        this.snackConfig.verticalPosition = "top";
        this.snackConfig.horizontalPosition = "center";
        this.snackConfig.duration = 3000;

        this.okDialogRef = this.dialog.open(OkDialogComponent, {
            disableClose: false,
            maxWidth:'500px'
        });
        this.okDialogRef.componentInstance.messageTxt = this.translate.instant('REGISTER.BEFORE_ALERT_MSG');
        this.okDialogRef.componentInstance.headerTxt = this.translate.instant('REGISTER.BEFORE_ALERT_HDR');
        this.okDialogRef.componentInstance.buttonTxt = this.translate.instant('GENERAL.CONFIRM_BTN');

    }

    onSubmit() {
        let user = <User>{
            mail: this.registerForm.value['email'].toLowerCase()
        };

        this.auth.register(user).subscribe(
            async (response:any) => {
                this.okDialogRef = this.dialog.open(OkDialogComponent, {
                    disableClose: false,
                    maxWidth:'500px'
                });
                this.okDialogRef.componentInstance.headerTxt = this.translate.instant('REGISTER.SUCCESSFUL_ALERT_HDR');
                this.okDialogRef.componentInstance.messageTxt = this.translate.instant('REGISTER.SUCCESSFUL_ALERT_MSG');
                this.okDialogRef.componentInstance.buttonTxt = this.translate.instant('GENERAL.CONFIRM_BTN');
                this.okDialogRef.afterClosed().subscribe(res =>{
                    this.router.navigateByUrl(`login`);
                });

            },
            async (error1: HttpErrorResponse) => {
                if (error1.status === 0) {

                } else if (error1.status === 400 && error1.error.includes('exists')) {
                    this.okDialogRef = this.dialog.open(OkDialogComponent, {
                        disableClose: false,
                        maxWidth:'500px'
                    });
                    this.okDialogRef.componentInstance.headerTxt = this.translate.instant('REGISTER.UNSUCCESSFUL_ALERT_HDR');
                    this.okDialogRef.componentInstance.messageTxt = this.translate.instant('REGISTER.EXISTS_ALERT_MSG');
                    this.okDialogRef.componentInstance.buttonTxt = this.translate.instant('GENERAL.CONFIRM_BTN');
                    this.okDialogRef.afterClosed().subscribe(res =>{
                        this.router.navigateByUrl(`login`);
                    });


                } else {
                    console.error(error1);
                }
            });
    }



}
