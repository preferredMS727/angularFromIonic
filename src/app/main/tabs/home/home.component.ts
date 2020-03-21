import {Component, OnInit} from '@angular/core';
// import {AlertController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
// import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {AlertButton} from '@ionic/core';
import {PageUtilsService} from '../../../services/page-utils.service';
import {ApiAuthService} from '../../../services/auth.service';

@Component({
    selector   : 'app-home',
    templateUrl: './home.component.html',
    styleUrls  : ['./home.component.scss']
})

export class HomeComponent implements OnInit
{
    constructor(
        // private alertCtrl: AlertController,
        public translate: TranslateService,
        public authService: ApiAuthService,
        public pageUtils: PageUtilsService
    )
    {    }

    ngOnInit(): void {
        const suppressIntroduction = localStorage.getItem('suppressIntroduction');
        if (!suppressIntroduction) {
            this.presentIntroductionPopup();
        }
    }

    private async presentIntroductionPopup(): Promise<void> {
        // const alert = await this.alertCtrl.create({
        //     header: this.translate.instant('HOME.INTRODUCTION_HDR'),
        //     message: this.translate.instant('HOME.INTRODUCTION_MSG'),
        //     buttons: [
        //         {
        //             text: this.translate.instant('GENERAL.CONFIRM_BTN')
        //         } as AlertButton,
        //         {
        //             text: this.translate.instant('GENERAL.DO_NOT_SHOW_BTN'),
        //             handler: async () => {
        //                 localStorage.setItem('suppressIntroduction', String(true));
        //             }
        //         }
        //     ]
        // });
        // await alert.present();
    }
}
