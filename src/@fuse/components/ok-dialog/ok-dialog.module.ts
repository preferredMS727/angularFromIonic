import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import { OkDialogComponent } from '@fuse/components/ok-dialog/ok-dialog.component';

@NgModule({
    declarations: [
        OkDialogComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        TranslateModule
    ],
    entryComponents: [
        OkDialogComponent
    ],
})
export class OkDialogModule
{
}
