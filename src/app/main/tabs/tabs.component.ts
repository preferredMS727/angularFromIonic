import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Asset} from '../../../api';
import {AlertController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {ApiAuthService} from '../../services/auth.service';
import {PageUtilsService} from '../../services/page-utils.service';
import {PlaylistService} from '../../services/playlist.service';
import {ProfileService} from '../../services/profile.service';
import { ApiTokenService } from 'app/services/token.service';
// import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

    insurances: Array<Asset> = undefined;

    constructor(
        private route: ActivatedRoute, private router: Router,
        private alertCtrl: AlertController,
        private pageUtils: PageUtilsService,
        private translate: TranslateService,
        private auth: ApiAuthService,
        private token: ApiTokenService,
        private playlistService: PlaylistService,
        private profileService: ProfileService,
        // private _fuseSplashScreenService: FuseSplashScreenService
    ) {
    }

    ngOnInit(): void {
        this.refresh();
    }

    async refresh(): Promise<void> {
        const userId = await this.auth.getUserId();
        const success = await this.profileService.refresh(userId);
        if (success) {
            this.insurances = await this.playlistService.refreshAllAssets(userId);
            if (this.insurances !== undefined) {
                console.log(`Got Assets on Tabs Page`);
                if (this.router.isActive(`tabs`, true)) {
                    await this.router.navigateByUrl(`tabs/home`);
                }

            }
        }
    }

}
