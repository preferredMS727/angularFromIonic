import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
// import { MatButtonModule, MatIconModule, MatLabel } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { FakeDbService } from 'app/fake-db/fake-db.service';
import { AuthGuard } from 'app/guard/auth.guard';
// import { TabsModule } from 'app/main/tabs/tabs.module';
import {DefaultService} from '../api';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {CurrencyPipe} from '@angular/common';
import { MaterialModule } from './main/material/material.module';
// import { AuthModule } from './auth/auth.module';

// import {PageUtilsService} from './services/page-utils.service';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadChildren: './auth/auth.module#AuthModule',
    },
    {
        path      : 'tabs/:userId',
        loadChildren: './main/tabs/tabs.module#TabsModule',
        canActivate: [AuthGuard]
    },
    // {
    //     path      : '**',
    //     redirectTo: 'tabs',
    //     canActivate: [AuthGuard]
    // }
];

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, {useHash: true}),

        TranslateModule.forRoot(),
        IonicModule,
        // InMemoryWebApiModule.forRoot(FakeDbService, {
        //     delay             : 0,
        //     passThruUnknownUrl: true
        // }),

        // Material moment date module
        MatMomentDateModule,

        // Material
        // MatButtonModule,
        // MatIconModule,
        // MatLabel,
        MaterialModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        // AuthModule,
        // TabsModule
    ],
    bootstrap   : [
        AppComponent
    ],
    providers: [
        AuthGuard,
        DefaultService,
        CurrencyPipe,
        // PageUtilsService
    ]
})
export class AppModule
{
}
