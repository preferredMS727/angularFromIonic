import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {DefaultService, ErrorObj} from '../../api';
import {HttpErrorResponse} from '@angular/common/http';
import {HelpComponent} from '../main/help/help.component';
// import { NgxSpinnerService } from 'ngx-spinner';
import { async } from '@angular/core/testing';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { AlertComponent } from '../_shared/alert/alert.component';
import { MatDialog, MatDialogConfig } from '@angular/material';

@Injectable({
  providedIn: 'root'
})

export class PageUtilsService {
    /**
     * Service to provide utils which are needed for each page
     * @param router: Angular router
     * @param api: ApiService for backend integration
     * @param alertCtrl: Controller for alerts
     * @param translate: Service for language configurations
     * @param loadingCtrl: Controller for loading pop up
     */
    constructor(
        private translate: TranslateService,
        private router: Router,
        private api: DefaultService,
        // private spinner: NgxSpinnerService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        public matDialog: MatDialog
    ) { }
    
    private loading = false;

    /**
     * Alert that the app is loading. Don't forget to dismiss with #stopLoading()
     */
    public async startLoading(): Promise<void> {
        if (!this.loading) {
            console.log('Start Loading');
            this._fuseSplashScreenService.show();

            setTimeout(() => {
                this._fuseSplashScreenService.hide();
                console.log('Set loading false');
                this.loading = false;
            }, 2000000);
            console.log('Set loading true');
            this.loading = true;
        }
    }

    public async showHelp(helpmsg: string): Promise<void> {
        const modalConfig = new MatDialogConfig();
        modalConfig.disableClose = false;
        modalConfig.id = 'help-component';
        modalConfig.data = {helpMsg: helpmsg};
        const modalDialog = this.matDialog.open(HelpComponent, modalConfig);
    }

    /**
     * Dismiss the loading alert.
     */
    public async stopLoading(): Promise<void> {
        if (this.loading) {
            console.log('Stop Loading');
            this._fuseSplashScreenService.hide();
            console.log('Set loading false');
            this.loading = false;
        }
    }

    /**
     * Alert that the app is unavailable.
     */
    public async unavailableAlert(errorMsg: any, userId = -1): Promise<void> {
        console.log('it is called before startLoading!');
        // await this.startLoading();
        const errorObj =  {
            userId: userId,
            timestamp: new Date().toUTCString(),
            properties: errorMsg
        } as ErrorObj;
        await this.api.errorPost(errorObj, 'response');

        const alert = this.matDialog.open(AlertComponent, {
            data: {
                header: this.translate.instant('GENERAL.SERVICE_UNAVAILABLE_HDR'),
                message: this.translate.instant('GENERAL.SERVICE_UNAVAILABLE_MSG'),
                buttons: [
                    {
                        text: this.translate.instant('GENERAL.CONFIRM_BTN'),
                        role: 'exit',
                    }
                ]
            }
        });
        alert.afterClosed().subscribe(result => {
            console.log('result: ', result);
            if (result === 'exit') {
                navigator['app'].exitApp();
            }
        });

        console.log('before call stoploading!');
        await this.stopLoading();
    }

    public async enableInternetAlert(): Promise<void> {
        const alert = this.matDialog.open(AlertComponent, {
            data: {
                header: this.translate.instant('GENERAL.ENABLE_INT_HDR'),
                message: this.translate.instant('GENERAL.ENABLE_INT_MSG'),
                buttons: [
                    {
                        text: this.translate.instant('GENERAL.SETTINGS'),
                        role: 'set',
                    }
                ]
            }
        });
        alert.afterClosed().subscribe(result => {
            console.log('result: ', result);
            if (result === 'set') {
                // this.openNativeSettings.open('settings');
            }
        });
    }

    public async showToast(result: string): Promise<void> {
        console.log(`Scan finished: ${result}`);
        // let openToast;
        // tslint:disable-next-line: no-conditional-assignment
        // while ((openToast = await this.toastCtrl.getTop()) !== undefined) {
        //     if (openToast.message === result) {
        //         await this.toastCtrl.dismiss();
        //     }
        // }
        // const toast = await this.toastCtrl.create( {
        //     message: result,
        //     showCloseButton: true,
        //     closeButtonText: this.translate.instant('GENERAL.CLOSE_BTN'),
        //     position: 'top',
        //     color: 'danger',
        //     keyboardClose: true
        // } as ToastOptions);
        // await toast.present();
    }

    // https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
    public b64toBlob(b64Data: string, contentType: string, sliceSize?: number): any {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: contentType});
    }

    async apiErrorHandler(e: HttpErrorResponse, userId: number, unauthorizedCallback): Promise<void> {
        if (e.status === 403) {
            await this.router.navigateByUrl(`tabs/${userId}/profile`);
            await this.showToast(this.translate.instant('PROFILE.PASSWORD_RESET'));
        } else if (e.status === 401) {
            await unauthorizedCallback();
        } else if (e.status === 0) {
            await this.enableInternetAlert();
        } else {
            console.error(e.message);
            await this.unavailableAlert(e.message, userId);
        }
    }
}
