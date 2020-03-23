import { Component, OnInit, Inject } from '@angular/core';
import {Asset} from '../../../../../api';
import {PageUtilsService} from '../../../../services/page-utils.service';
import {AddComponent} from '../add/add.component';
import {InstructionComponent} from '../instruction/instruction.component';
import {AlertButton, AlertInput, AlertOptions} from '@ionic/core';
import {TranslateService} from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import TypeEnum = Asset.TypeEnum;
// import { DialogData } from '../insurance-list/insurance-list.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {
    userId: number;
    terms: string;
    insurances: Asset[] = [
        {name: 'Deutsche Rentenversicherung', type: TypeEnum.Gesetzliche, additional: {}},
        {name: '', type: TypeEnum.Betriebliche},
        {name: '', type: TypeEnum.Riester, additional: {}},
        {name: '', type: TypeEnum.Sonstige}
    ];

    private suppressInstruction = false;

    constructor(
        private utils: PageUtilsService,
        private translate: TranslateService,
        private pageUtils: PageUtilsService,
        public dialogRef: MatDialogRef<SearchComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public matDialog: MatDialog
    ) { }

    ngOnInit(): void {
    }

    closeModal(): void {
        this.dialogRef.close();
    }

    /**
     * This method proceeds the user to take a complete photo of the insurance selected
     * @param insurance: the insurance selected
     */
    async addInsurance(insurance: Asset, subHeader = ''): Promise<void> {
        console.log(insurance);
        const alertDialogConfig = new MatDialogConfig();
        // The user can't close the dialog by clicking outside its body
        alertDialogConfig.disableClose = true;
        alertDialogConfig.id = 'alert-component';
        alertDialogConfig.height = '350px';
        alertDialogConfig.width = '300px';
        alertDialogConfig.data = {userId: this.userId, insurance: insurance};
        // https://material.angular.io/components/dialog/overview
        const modalDialog = this.matDialog.open(AlertComponent, alertDialogConfig);
        modalDialog.afterClosed().subscribe(result => {
            console.log('The dialog was closed: ', result);
            // this.getInsurances(userId);
        });

        // const alert = await this.alertCtrl.create( {
        //     header: this.translate.instant('SEARCH.ALERT_HDR', {insuranceType: insurance.type}),
        //     message: this.translate.instant('SEARCH.ALERT_MSG', {optional: subHeader}),
        //     backdropDismiss: false,
        //     inputs:  [
        //         {
        //             name: 'insuranceName',
        //             value: insurance.name,
        //             type: 'text',
        //             placeholder: this.translate.instant('SEARCH.ALERT_INPUT_PLC')
        //         }
        //     ] as AlertInput[],
        //     buttons:  [
        //         {
        //             text: this.translate.instant('GENERAL.CANCEL_BTN'),
        //             role: 'cancel'
        //         },
        //         {
        //             text: this.translate.instant('GENERAL.CONFIRM_BTN'),
        //             handler: async (data) => {
        //                 if (data.insuranceName !== '') {
        //                     insurance.name = data.insuranceName;
        //                     const suppressInstruction = localStorage.getItem('suppressInstruction');
        //                     if (suppressInstruction) {
        //                         this.addPage(insurance);
        //                     } else {
        //                         this.showInstructions(() => this.addPage(insurance), insurance.type);
        //                     }
        //                 } else {
        //                     this.addInsurance(
        //                         insurance,
        //                         `<p style="color: red">${this.translate.instant('SEARCH.ALERT_NO_NAME')}</p>`);
        //                 }
        //             }
        //         }
        //     ] as AlertButton[]
        // } as AlertOptions);
        // await alert.present();
    }

    private getLabelForType(type: TypeEnum): any {
        switch (type) {
            case TypeEnum.Gesetzliche:
                return this.translate.instant('GENERAL.STATUORY_PENSION_LBL');
            case 'Betriebliche':
                return this.translate.instant('GENERAL.OCCUPATIONAL_PENSION_LBL');
            case 'Riester':
                return this.translate.instant('GENERAL.PRIVATE_PENSION_LBL');
            case 'Sonstige':
                return this.translate.instant('GENERAL.MISCELLANEOUS_PENSION_LBL');
        }
    }

}
