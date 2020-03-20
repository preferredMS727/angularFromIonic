import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector   : 'fuse-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls  : ['./confirm-dialog.component.scss']
})
export class FuseConfirmDialogComponent
{
    public messageTxt: string;
    public headerTxt: string;
    public yesButtonTxt: string;
    public noButtonTxt: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<FuseConfirmDialogComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<FuseConfirmDialogComponent>,
        private translate: TranslateService,
    )
    {
    }

}
