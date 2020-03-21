import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// import { FuseSharedModule } from '@fuse/shared.module';

import { HomeComponent } from './home.component';
// import { FuseConfirmDialogModule } from '../../../../@fuse/components';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { MatButtonModule, MatLabel } from '@angular/material';
// import { MaterialModule } from 'app/main/material/material.module';

import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// import {File} from '@ionic-native/file/ngx';
import {InsuranceListComponent} from './insurance-list/insurance-list.component';
import {SearchComponent} from './search/search.component';
import {SearchPipe} from '../../../pipes/search.pipe';
import { AddComponent } from './add/add.component';
import {InstructionComponent} from './instruction/instruction.component';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from 'app/main/material/material.module';
// import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
// import {Camera} from '@ionic-native/camera/ngx';
   
const homeRoute: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: '',
                component: InsuranceListComponent
            }
        ]
    }
];

@NgModule({
    declarations: [HomeComponent, InsuranceListComponent, AddComponent, SearchComponent, InstructionComponent],
    imports     : [
        CommonModule,
        FormsModule,
        RouterModule.forChild(homeRoute),
        TranslateModule.forChild(),
        ReactiveFormsModule,
        MaterialModule
    ],
    entryComponents: [SearchComponent, InstructionComponent, AddComponent],
    providers: [
        // File,
        // AbbyyRTR,
        // PhotoViewer,
        // Camera
    ]
})

export class HomeModule
{
}
