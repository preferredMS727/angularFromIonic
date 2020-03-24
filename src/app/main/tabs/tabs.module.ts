import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { TabsComponent } from './tabs.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {TranslateModule} from '@ngx-translate/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { FuseSharedModule } from '@fuse/shared.module';

import { FuseConfirmDialogModule } from '../../../@fuse/components';
import { MaterialModule } from '../material/material.module';
import { GapComponent } from './gap/gap.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { ProfileComponent } from './profile/profile.component';
import { TabsComponent } from './tabs.component';
import { HelpComponent } from '../help/help.component';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { MatButtonModule, MatLabel } from '@angular/material';
// import { MaterialModule } from 'app/main/material/material.module';
// import { AuthGuard } from 'app/guard/auth.guard';

const tabsRoute: Routes = [
    // {
    //     path: '',
    //     redirectTo: 'tabs',
    // },
    {
        path: '',
        component: TabsComponent,
        children: [
            {
                path: 'home',
                // component: HomeComponent
                // loadChildren: './home/home.module#HomeModule'
                loadChildren: () => import('./home/home.module').then(m => m.HomeModule)

            },
            {
                path: 'gap',
                component: GapComponent
                // loadChildren: './gap/gap.module#GapModule'
            },
            {
                path: 'playlist',
                component: PlaylistComponent
                // loadChildren: './playlist/playlist.module#PlaylistModule'
            },
            {
                path: 'profile',
                component: ProfileComponent
                // loadChildren: './profile/profile.module#ProfileModule'
            },
            // { path: '', redirectTo: 'home', pathMatch: 'full'}      
        ]
    }

];

@NgModule({
  declarations: [ TabsComponent, GapComponent, PlaylistComponent, ProfileComponent, HelpComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(tabsRoute),
    TranslateModule.forChild(),
    ReactiveFormsModule,
    TranslateModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    MaterialModule
  ]
})

export class TabsModule { }
