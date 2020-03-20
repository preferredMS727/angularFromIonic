import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector   : 'ok-dialog',
    templateUrl: './ok-dialog.component.html',
    styleUrls  : ['./ok-dialog.component.scss']
})
export class OkDialogComponent
{
    public messageTxt: string;
    public headerTxt: string;
    public buttonTxt: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<FuseConfirmDialogComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<OkDialogComponent>,
        private translate: TranslateService,
    )
    {
    }

}
