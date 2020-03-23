import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {AlertController} from '@ionic/angular';
import {PageUtilsService} from '../../services/page-utils.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MatDialog } from '@angular/material';
import { AlertComponent } from 'app/_shared/alert/alert.component';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-data-protection',
  templateUrl: './data-protection.component.html',
  styleUrls: ['./data-protection.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DataProtectionComponent implements OnInit {
    agreement: boolean;

    constructor(
        private router: Router,
        private pageUtils: PageUtilsService,
        private route: ActivatedRoute,
        private alertCtrl: AlertController,
        private translate: TranslateService,
        public matDialog: MatDialog,
        private _fuseConfigService: FuseConfigService,
        private _location: Location
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
    }

    ngOnInit(): void {
        const dataProtectionAgreement = Boolean(localStorage.getItem('dataProtectionAgreement'));
        if (dataProtectionAgreement) {
            this.agreement = dataProtectionAgreement;
        }
    }

    async suppressDataProtection(): Promise<void> {
        console.log(`1: ${this.agreement}`);
        localStorage.setItem('dataProtectionAgreement', String(this.agreement));
        if (!this.agreement) {
            const alert = this.matDialog.open(AlertComponent, {
                data: {
                    header: this.translate.instant('DATA_PROTECTION.NOT_ACCEPTED_HDR'),
                    message: this.translate.instant('DATA_PROTECTION.NOT_ACCEPTED_MSG'),
                    buttons: [
                        {
                            text: this.translate.instant('GENERAL.CONFIRM_BTN'),
                            role: 'cancel'
                        },
                    ]
                }
            });
        }
    }

    back(): void {
        console.log('back');
        // this.router.navigate(['..//', {}, { relativeTo: this.route }]);
        this._location.back();
    }

}
