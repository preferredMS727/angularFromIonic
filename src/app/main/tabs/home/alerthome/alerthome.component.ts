import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
// import { DialogData } from '../search/search.component';
import { Asset } from 'api';
import TypeEnum = Asset.TypeEnum;
import { AddComponent } from '../add/add.component';
import { InstructionComponent } from '../instruction/instruction.component';

@Component({
  selector: 'app-alert',
  templateUrl: './alerthome.component.html',
  styleUrls: ['./alerthome.component.scss']
})
export class AlerthomeComponent implements OnInit {
    userId: string;
    insurance: any;

    constructor(
        public translate: TranslateService,
        public dialogRef: MatDialogRef<AlerthomeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private matDialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.insurance = this.data.insurance;
        this.userId = this.data.userId;
    }

    closeModal(): void {
        this.dialogRef.close();
    }

    handle(insuranceName): void {
        console.log('insuranceName: ', insuranceName);
        if (insuranceName !== '') {
            //  have to change Search component insurance name, but it is not working now
            // insurance.name = insuranceName;
            const suppressInstruction = localStorage.getItem('suppressInstruction');
            if (suppressInstruction) {
                this.addPage(this.data.insurance);
            } else {
                this.showInstructions(() => this.addPage(this.insurance), this.insurance.type);
            }
        } else {
            // this.addInsurance(
            //     insurance,
            //     `<p style="color: red">${this.translate.instant('SEARCH.ALERT_NO_NAME')}</p>`);
        }
        this.dialogRef.close();
    }

    async addPage(insurance: Asset): Promise<void> {
        const modalConfig = new MatDialogConfig();
        modalConfig.disableClose = true;
        modalConfig.id = 'add-component';
        modalConfig.maxHeight = '900px';
        // modalConfig.position  = { top: '5%', bottom: '5%'};
        // modalConfig.height = '650px';
        // modalConfig.width = '600px';
        modalConfig.data = {userId: this.userId, insuranceType: this.insurance.type, insuranceName: this.insurance.name};
        const modalDialog = this.matDialog.open(AddComponent, modalConfig);
    }

    /**
     * This method displays the instructions on what to do
     * @param callback -
     */
    async showInstructions(callback, insuranceType: TypeEnum): Promise<void> {
        console.log('Show instructions.');
        let instructionText = '';
        switch (insuranceType) {
            case 'Gesetzliche':
                instructionText = await this.translate.instant('INSTRUCTION.TEXT', {
                    instrParam: this.translate.instant('INSTRUCTION.MUTUAL_INSURANCE')
                });
                break;
            case 'Betriebliche':
                instructionText = await this.translate.instant('INSTRUCTION.FIRM_INSURANCE');
                break;
            case 'Riester':
                instructionText = await this.translate.instant('INSTRUCTION.TEXT', {
                    instrParam: this.translate.instant('INSTRUCTION.PRIVATE_INSURANCE')
                });
                break;
            case 'Sonstige':
                instructionText = await this.translate.instant('INSTRUCTION.OTHER_INSURANCE');
                break;
        }
        console.log(instructionText);

        const modalConfig = new MatDialogConfig();
        modalConfig.disableClose = true;
        modalConfig.id = 'instruction-component';
        modalConfig.height = '650px';
        modalConfig.width = '600px';
        modalConfig.data = {instructionText: instructionText};
        const modalDialog = this.matDialog.open(InstructionComponent, modalConfig);
        modalDialog.afterClosed().subscribe(callback);
    }
}
