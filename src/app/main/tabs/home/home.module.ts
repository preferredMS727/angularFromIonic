import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { HomeComponent } from './home.component';
import { FuseConfirmDialogModule } from '../../../../@fuse/components';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule, MatLabel } from '@angular/material';
import { MaterialModule } from 'app/main/material/material.module';

   
@NgModule({
    declarations: [
        HomeComponent,
    ],
    imports     : [
        TranslateModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        MatProgressBarModule,
        MatButtonModule,
        MaterialModule
    ],
    exports     : [
        HomeComponent,
    ]
})

export class HomeModule
{
}
