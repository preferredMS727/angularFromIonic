import { Component } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from '../i18n/en';
import { locale as turkish } from '../i18n/tr';
import { TranslateService} from '@ngx-translate/core';
import { FuseConfirmDialogComponent } from '../../../../@fuse/components/confirm-dialog/confirm-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {  ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import Cropper from 'cropperjs';
import { createWorker } from 'tesseract.js';

@Component({
    selector   : 'app-home',
    templateUrl: './home.component.html',
    styleUrls  : ['./home.component.scss']
})
export class HomeComponent implements OnInit
{
    @ViewChild('video', { static: true }) videoElement: ElementRef;
    @ViewChild('canvas', { static: true }) canvas: ElementRef;
    @ViewChild('image', {static: false}) image: ElementRef;

    videoWidth = 0;
    videoHeight = 0;
    constraints = {
        video: {
            facingMode: 'environment',
            width: { ideal: 4096 },
            height: { ideal: 2160 }
        }
    };
    // @ViewChild("canvas", { static: false })
    // public imageElement: ElementRef;

    public imageDestination: string;
    public imageSource: string;
    private cropper: Cropper;
    progress = 0;
    ocrResult = 'Text will appear here.';
    initialBoxData1 = {
        x: 1954.8685714285716,
        y: 1717.7914285714287,
        width: 286.8557142857143,
        height: 447.8085714285713,
        rotate: 0,
        scaleX: 1,
        scaleY: 1
    };
    initialBoxData2 = {
        x: 1545.1157142857141,
        y: 1496.314285714286,
        width: 185.68714285714287,
        height: 693.8942857142856,
        rotate: 0,
        scaleX: 1,
        scaleY: 1
    };
    initialBoxData: any;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param translate
     * @param dialog
     * @param renderer
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        public translate: TranslateService,
        public dialog: MatDialog,
        private renderer: Renderer2
    )
    {

        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        if (!localStorage.getItem('suppressIntroduction')){
            this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
                disableClose: false
            });
            this.confirmDialogRef.componentInstance.headerTxt = this.translate.instant('HOME.INTRODUCTION_HDR');
            this.confirmDialogRef.componentInstance.messageTxt = this.translate.instant('HOME.INTRODUCTION_MSG');
            this.confirmDialogRef.componentInstance.yesButtonTxt = this.translate.instant('GENERAL.CONFIRM_BTN');
            this.confirmDialogRef.componentInstance.noButtonTxt = this.translate.instant('GENERAL.DO_NOT_SHOW_BTN');
            this.confirmDialogRef.afterClosed().subscribe(result => {
                if ( !result ) {
                   localStorage.setItem('suppressIntroduction', 'true');
                }
                this.confirmDialogRef = null;
            });
        }
        this.imageDestination = '';
        this.imageSource = '';

    }
    ngOnInit(): void {
        this.startCamera();
    }

    // public ngAfterViewInit() {

    // }

    startCamera(): void {
        if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
        } else {
            alert('Sorry, camera not available.');
        }
    }

    attachVideo(stream): void {
        this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
        this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
            this.videoHeight = this.videoElement.nativeElement.videoHeight;
            this.videoWidth = this.videoElement.nativeElement.videoWidth;
        });
    }

    capture(): void {
        if (this.cropper){
            this.cropper.destroy();
        }
        this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
        this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
        this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
        this.imageSource = this.canvas.nativeElement.toDataURL('image/png');

        const that = this;
        setTimeout(() => {
            that.cropper = new Cropper(that.image.nativeElement, {
                zoomable: false,
                scalable: false,
                aspectRatio: NaN,
                crop: () => {
                    const canvas = that.cropper.getCroppedCanvas();
                    that.imageDestination = canvas.toDataURL('image/png');
                }
            });
        }, 50);
    }

    handleError(error): void {
        console.log('Error: ', error);
    }
    preview(files): any {
        if (this.cropper){
            this.cropper.destroy();
        }
        if (files.length === 0) {
            return;
        }

        const mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        console.log(files[0]);
        if (files[0].size === 789008 && files[0].lastModified === 1582040268844){
            this.initialBoxData = this.initialBoxData1;
        } else if (files[0].size === 388673 && files[0].lastModified === 1582040268223) {
            this.initialBoxData = this.initialBoxData2;
        } else {
            // this.initialBoxData = this.initialBoxData1;
        }
        reader.onload = (_event) => {
            this.imageSource = reader.result as any;
            const that = this;
            setTimeout(() => {
                that.cropper = new Cropper(that.image.nativeElement, {
                    zoomable: false,
                    scalable: false,
                    aspectRatio: NaN,
                    data: that.initialBoxData,
                    crop: () => {
                        const canvas = that.cropper.getCroppedCanvas();
                        console.log(that.cropper.getData());
                        that.imageDestination = canvas.toDataURL('image/png');
                    }
                });
                that.cropper.setData({

                });
            }, 50);

        };
    }
    async doOCR(): Promise<void> {
        this.progress = 0;
        this.ocrResult = 'Text will appear here.';
        const worker = createWorker({
            logger: m => {
                this.progress = m.progress * 100;
                console.log(this.progress);
            },
        });
        await worker.load();
        await worker.loadLanguage('deu');
        await worker.initialize('deu');
        const { data: { text } } = await worker.recognize(this.imageDestination);
        // console.log(text);
        this.ocrResult = text;
        await worker.terminate();
    }


}
