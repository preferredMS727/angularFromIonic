import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { HomeComponent } from './home.component';
import { AuthGuard } from 'app/guard/auth.guard';
import { FuseConfirmDialogModule } from "../../../@fuse/components";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatButtonModule } from "@angular/material/button";

const routes = [
    {
        path     : 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        FuseConfirmDialogModule,
        MatProgressBarModule,
        MatButtonModule
    ],
    exports     : [
        HomeComponent
    ]
})

export class HomeModule
{
}
