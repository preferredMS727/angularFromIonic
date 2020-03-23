import { Component, OnInit, Inject } from '@angular/core';
import {PageUtilsService} from '../../../../services/page-utils.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.scss']
})

export class InstructionComponent implements OnInit {

    public instruction: boolean;
    public instructionText: string;

    constructor(
        private pageUtils: PageUtilsService,
        public dialogRef: MatDialogRef<InstructionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,

    ) {
        this.instructionText = this.data.instructionText;
        const suppressInstruction = Boolean(localStorage.getItem('suppressInstruction'));
        if (suppressInstruction) {
            this.instruction = suppressInstruction;
        } else {
            this.instruction = false;
        }
    }

    ngOnInit(): void {
    }

    suppressInstruction(): void {
        console.log('suppressInstruction');
        localStorage.setItem('suppressInstruction', String(this.instruction));
    }

    closeModal(): void {
        this.dialogRef.close();
    }

}
