import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { navigation } from 'app/navigation/navigation';
import {ApiAuthService} from "../../../services/auth.service";
import { User } from 'app/models/user';
import { ApiTokenService } from "../../../services/token.service";
import { OkDialogComponent } from "../../../../@fuse/components/ok-dialog/ok-dialog.component";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector     : 'toolbar',
    templateUrl  : './toolbar.component.html',
    styleUrls    : ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy
{
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];
    user = new User();
    okDialogRef: MatDialogRef<OkDialogComponent>;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     * @param _apiAuthService
     * @param token
     * @param dialog
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        private _apiAuthService: ApiAuthService,
        public token: ApiTokenService,
        public dialog: MatDialog,
    )
    {
        // Set the defaults
        this.userStatusOptions = [
            {
                title: 'Online',
                icon : 'icon-checkbox-marked-circle',
                color: '#4CAF50'
            },
            {
                title: 'Away',
                icon : 'icon-clock',
                color: '#FFC107'
            },
            {
                title: 'Do not Disturb',
                icon : 'icon-minus-circle',
                color: '#F44336'
            },
            {
                title: 'Invisible',
                icon : 'icon-checkbox-blank-circle-outline',
                color: '#BDBDBD'
            },
            {
                title: 'Offline',
                icon : 'icon-checkbox-blank-circle-outline',
                color: '#616161'
            }
        ];

        this.languages = [
            {
                id   : 'en',
                title: 'English',
                flag : 'us'
            },
            // {
            //     id   : 'tr',
            //     title: 'Turkish',
            //     flag : 'tr'
            // }
        ];

        this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        // this.okDialogRef = this.dialog.open(OkDialogComponent, {
        //     disableClose: false,
        //     maxWidth:'500px'
        // });
        // this.okDialogRef.componentInstance.messageTxt = this._translateService.instant('REGISTER.BEFORE_ALERT_MSG');
        // this.okDialogRef.componentInstance.headerTxt = this._translateService.instant('PROFILE.HELP_BTN');
        // this.okDialogRef.componentInstance.buttonTxt = this._translateService.instant('GENERAL.BACK_BTN');

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, {id: this._translateService.currentLang});
        let  that = this;
        setTimeout(function(){
            that.user = that.token.getUser();
        },1000);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void
    {
        // Do your search here...
        console.log(value);
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void
    {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }
    logout(){
        this._apiAuthService.logout();
    }
    showHelp(){
        this.okDialogRef = this.dialog.open(OkDialogComponent, {
            disableClose: false,
            maxWidth:'500px'
        });
        this.okDialogRef.componentInstance.headerTxt = this._translateService.instant('PROFILE.HELP_BTN');
        this.okDialogRef.componentInstance.messageTxt = this._translateService.instant('HELP.HOME_TEXT');
        this.okDialogRef.componentInstance.buttonTxt = this._translateService.instant('GENERAL.BACK_BTN');
    }
}
