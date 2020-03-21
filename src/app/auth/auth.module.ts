import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatSnackBarModule,
    MatIconModule, MatInputModule, MatRadioModule} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';
import {TranslateModule} from '@ngx-translate/core';
import { FuseConfirmDialogModule} from '../../@fuse/components';
import { OkDialogModule} from '../../@fuse/components/ok-dialog/ok-dialog.module';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    }
];

@NgModule({
    declarations: [LoginComponent,  ForgotPasswordComponent, RegisterComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSnackBarModule,
        TranslateModule.forChild(),

        FuseSharedModule,

        FormsModule,
        ReactiveFormsModule,
        FuseConfirmDialogModule,
        OkDialogModule
    ],
    providers: [
    ]
})
export class AuthModule {
}
