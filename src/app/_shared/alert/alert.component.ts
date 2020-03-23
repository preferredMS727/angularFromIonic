import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
    constructor(
        private translate: TranslateService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public matDialogRef: MatDialogRef<AlertComponent>
    ) {
    }

    ngOnInit(): void {
        console.log('alert component input data: ', this.data);
    }

    close(role: string): void {
        this.matDialogRef.close(role);
    }

}
