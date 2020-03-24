import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { deflate } from 'zlib';

@Injectable({
  providedIn: 'root'
})
export class PageChangeActionService {
    /**
     * This method initializes the assetsArray to be displayed
     * @param activatedRoute -
     * @param translate -
     */
    public logoText = '';

    constructor(
        private translate: TranslateService
    ) {
        this.logoText = this.translate.instant('HOME.TITLE');
    }

    public getLogoText(route): string {
        switch (route) {
            case '/tabs/home': this.logoText = this.translate.instant('HOME.TITLE'); break;
            case '/tabs/gap': this.logoText = this.translate.instant('GAP.TITLE'); break;
            case '/tabs/playlist': this.logoText = this.translate.instant('PLAYLIST.TITLE'); break;
            case '/tabs/profile': this.logoText = this.translate.instant('PROFILE.TITLE'); break;
            default: this.logoText = this.translate.instant('HOME.TITLE'); break;
        }
        return this.logoText;
    }
}
