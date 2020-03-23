import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Asset, DefaultService} from '../../../../../api';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
// import {AlertController, ModalController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {PageUtilsService} from '../../../../services/page-utils.service';
import {AlertButton, AlertOptions, ModalOptions} from '@ionic/core';
import {SearchComponent} from '../search/search.component';
import {ApiAuthService} from '../../../../services/auth.service';
import {PlaylistService} from '../../../../services/playlist.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ProfileService} from '../../../../services/profile.service';
import TypeEnum = Asset.TypeEnum;
import { ApiTokenService } from 'app/services/token.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

// export interface DialogData {
//     animal: string;
//     name: string;
// }

@Component({
  selector: 'app-insurance-list',
  templateUrl: './insurance-list.component.html',
  styleUrls: ['./insurance-list.component.scss']
})

export class InsuranceListComponent implements OnInit {

    private static instance: InsuranceListComponent;

    private gesetzlichePension = 0;
    private betrieblichePension = 0;
    private riesterPension = 0;
    public pension = 0;

    public assetsMap = new Map<Asset, number>();
    public assets: any[] = [];
    private gesetzlicheArray = new Array<Asset>();
    private betrieblicheArray = new Array<Asset>();
    private riesterArray = new Array<Asset>();
    private insuranceImages: Array<string>;

    private intervalId: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private api: DefaultService,
        // private alertCtrl: AlertController,
        private router: Router,
        private translate: TranslateService,
        private pageUtils: PageUtilsService,
        // private modalCtrl: ModalController,
        private auth: ApiAuthService,
        private toekn: ApiTokenService,
        private playlistService: PlaylistService,
        private changeDetector: ChangeDetectorRef,
        private profileService: ProfileService,
        private cdr: ChangeDetectorRef,
        public matDialog: MatDialog
    ) { 
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.auth.getUserId().then(async userId => {
                    if (userId !== undefined && this.router.isActive(`tabs/home`, true)) {
                        await this.getInsurances(userId);
                    }
                    }
                );
            }
        });
        InsuranceListComponent.instance = this;
    }

    async ngOnInit(): Promise<void> {
    }

    /*
     * This method deletes the insurancesStatic the user selected
     * @param asset: The insurance to be deleted
     */

    private async getInsurances(userId: number): Promise<void> {
        await this.pageUtils.startLoading();

        if (this.intervalId !== undefined) {
            clearInterval(this.intervalId);
        }
        this.intervalId = setInterval(this.getInsurances.bind(InsuranceListComponent.instance), 15 * 60 * 1000, [userId]);
        this.assetsMap = new Map<Asset, number>();
        this.gesetzlicheArray = new Array<Asset>();
        this.betrieblicheArray = new Array<Asset>();
        this.riesterArray = new Array<Asset>();
        this.assets = await this.playlistService.getAssets(userId);
        // console.log(this.playlistService.getAssets(userId));
        console.log('useID: ', this.riesterArray);
        // this.playlistService.getAssets(userId).then(async assets => {
        console.log('assets: ', this.assets);

        for (const asset of this.assets) {
            const array = [asset];
            const pension = await this.playlistService.calcExpectedPension(userId, array);
            asset['value'] = pension.get(80);

            this.assetsMap.set(asset, pension.get(80));
            switch (asset.type) {
                case TypeEnum.Gesetzliche:
                    this.gesetzlicheArray.push(asset);
                    break;
                case TypeEnum.Betriebliche:
                    this.betrieblicheArray.push(asset);
                    break;
                case TypeEnum.Riester:
                    this.riesterArray.push(asset);
            }
        }

        console.log('assets: ', this.assets);
        console.log('assetsMap: ', this.assetsMap);

        await this.setPension(userId);
        await this.pageUtils.stopLoading();
        // });

    }

    getKeysOfAssets(): any {
        const keys = this.assetsMap.keys();
        // this.cdr.detectChanges();
        return keys;
    }

    private async setPension(userId: number): Promise<void> {
        /*await this.playlistService.calcExpectedPension(userId, this.gesetzlicheArray).then(map => {
            this.gesetzlichePension = map.get(80);
        });
        await this.playlistService.calcExpectedPension(userId, this.betrieblicheArray).then(map => {
            this.betrieblichePension = map.get(80);
        });
        await this.playlistService.calcExpectedPension(userId, this.riesterArray).then(map => {
            this.riesterPension = map.get(80);
        });*/
        this.pension = (await this.playlistService.getInsurancePension(userId)).get(80);
        this.changeDetector.markForCheck();
    }
    // public async deleteInsurance(asset: Asset) {
    //     const alert = await this.alertCtrl.create(<AlertOptions>{
    //         header: this.translate.instant('HOME.DELETE_INSURANCE_HDR', {
    //             insurance_name: asset.name
    //         }),
    //         message: this.translate.instant('HOME.DELETE_INSURANCE_MSG', {
    //             insurance_name: asset.name
    //         }),
    //         buttons: [<AlertButton>
    //             {
    //                 text: this.translate.instant('GENERAL.NO_BTN'),
    //                 role: 'cancel',
    //             },
    //             {
    //                 text: this.translate.instant('GENERAL.YES_BTN'),
    //                 handler: () => this.deleteInsuranceHandler(asset)
    //             }
    //         ]
    //     });
    //     await alert.present();
    // }

    /*
     * This method adds an insurance to the view
     */
    public async addInsurance(): Promise<void> {
        await this.pageUtils.startLoading();
        const userId = await this.auth.getUserId();

        const dialogConfig = new MatDialogConfig();
        // The user can't close the dialog by clicking outside its body
        dialogConfig.disableClose = true;
        dialogConfig.id = 'modal-component';
        dialogConfig.height = '500px';
        dialogConfig.width = '600px';
        dialogConfig.data = {userId: userId};
        // https://material.angular.io/components/dialog/overview
        const modalDialog = this.matDialog.open(SearchComponent, dialogConfig);
        modalDialog.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.getInsurances(userId);
        });

        await this.pageUtils.stopLoading();
        // const modal = await this.modalCtrl.create( {
        //     component: SearchComponent,
        //     componentProps: {userId: userId}
        // } as ModalOptions);
        // await modal.present();
        // modal.onDidDismiss().then(() => this.getInsurances(userId));
    }

    /**
     * This insurance deletes a certain insurance from the backend
     * @param asset: The insurance to delete from the backend
     */
    private async deleteInsuranceHandler(asset: Asset): Promise<void> {
        await this.pageUtils.startLoading();
        this.api.configuration.accessToken = await this.toekn.get();
        this.api.configuration.withCredentials = true;
        const userId = await this.auth.getUserId();
        this.api.usersUserIdAssetsAssetIdDelete(userId, asset.id).subscribe(
            async () => {
                await this.pageUtils.stopLoading();
                await this.playlistService.refreshAllAssets(userId);
                await this.getInsurances(userId);
            },
            async (error: HttpErrorResponse) => {
                await this.pageUtils.stopLoading();
                await this.pageUtils.apiErrorHandler(error, userId, this.auth.refreshToken());
            });
    }
}
