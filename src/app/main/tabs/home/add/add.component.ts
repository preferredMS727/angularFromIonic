import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, AfterViewInit, Inject} from '@angular/core';
import {Asset, DefaultService} from '../../../../../api';
import {FormControl, FormGroup, Validators} from '@angular/forms';
// import {AbbyyRTR, TextCaptureResult} from '@ionic-native/abbyy-rtr/ngx';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
// import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {ActivatedRoute, Router} from '@angular/router';
import {PageUtilsService} from '../../../../services/page-utils.service';
// import {File, FileEntry} from '@ionic-native/file/ngx';
import {InstructionComponent} from '../instruction/instruction.component';
// import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {PlaylistService} from '../../../../services/playlist.service';
import {ApiAuthService} from '../../../../services/auth.service';
import {ApiTokenService} from '../../../../services/token.service';
// import {Camera} from '@ionic-native/camera/ngx';
// import {AlertButton, AlertOptions} from '@ionic/core';
import TypeEnum = Asset.TypeEnum;
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';

export interface Tile {
    color: string;
    cols: number;
    rows: number;
    text: string;
}

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddComponent implements OnInit, AfterViewInit {
    tiles: Tile[] = [
        {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
        {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
        {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
        {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
    ];

    public assetModel: Asset;
    private userId: number;

    public ready: boolean;

    public date = ''; // date of insurance input

    public insuranceNumberCtrl = new FormControl('', Validators.required);
    public insuranceNumberFormGroup = new FormGroup({
        insuranceNumber: this.insuranceNumberCtrl
    });
    public titleCtrl = new FormControl('', Validators.required);
    public nameCtrl = new FormControl('');
    public streetCtrl = new FormControl('');
    public cityCtrl = new FormControl('');
    public addressFormGroup = new FormGroup({
        title: this.titleCtrl,
        name: this.nameCtrl,
        street: this.streetCtrl,
        city: this.cityCtrl
    });
    public lastContributionsCtrl = new FormControl('');
    public lastAmortizationsCtrl = new FormControl('');
    public lastReceivedBonusCtrl = new FormControl('');
    public lastRefundedBonusCtrl = new FormControl('');
    public bonusesCtrl = new FormControl('');
    public contributionsCtrl = new FormControl('');
    public fullRecCtrl = new FormControl('');
    public currentPensionCtrl = new FormControl('');
    public extrapolatedPensionCtrl = new FormControl('');
    public occInvalidityCtrl = new FormControl('');
    public widowPensionCtrl = new FormControl('');
    public warrantedPensionCtrl = new FormControl('');
    public pensionInformationFormGroup = new FormGroup({
        occInvalidity: this.occInvalidityCtrl,
        fullRec: this.fullRecCtrl,
        currentPension: this.currentPensionCtrl,
        extrapolatedPension: this.extrapolatedPensionCtrl,
        widowPension: this.widowPensionCtrl,
        warrantedPension: this.warrantedPensionCtrl,
        lastContributions: this.lastContributionsCtrl,
        lastAmortizations: this.lastAmortizationsCtrl,
        lastReceivedBonus: this.lastReceivedBonusCtrl,
        lastRefundedBonus: this.lastRefundedBonusCtrl,
        bonuses: this.bonusesCtrl,
        contributions: this.contributionsCtrl
    });
    public yearCtrl = new FormControl('', [Validators.required, Validators.min(1900), Validators.max(2100)]);
    public yearFormGroup = new FormGroup({
        year: this.yearCtrl
    });
    public customForms: Array<CustomForm>;
    private readonly pensionInfoCtrls = [this.fullRecCtrl,
        this.currentPensionCtrl,
        this.extrapolatedPensionCtrl,
        this.occInvalidityCtrl,
        this.widowPensionCtrl,
        this.warrantedPensionCtrl];

    // private ocrResults: Array<TextCaptureResult> = [];

    public currentIndex = 0;

    private photoIndex = 0;

    private readonly imgAssetsDir: string = 'www/assets/img/';

    public insuranceName;
    public insuranceType: TypeEnum;
    public imageAsB64 = new Map<number, string>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        // private abbyyRtr: AbbyyRTR,
        // private photoViewer: PhotoViewer,
        // private file: File,
        private api: DefaultService,
        private translate: TranslateService,
        // private storage: NativeStorage,
        // private camera: Camera,
        private alertCtrl: AlertController,
        public modalCtrl: ModalController,
        private toastCtrl: ToastController,
        private pageUtils: PageUtilsService,
        private playlistService: PlaylistService,
        private authService: ApiAuthService,
        private tokenService: ApiTokenService,
        private cd: ChangeDetectorRef,
        public dialogRef: MatDialogRef<AddComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private matDialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.insuranceName = this.data.insuranceName;
        this.insuranceType = this.data.insuranceType;
        this.userId = this.data.userId;

        console.log('AddComponentOnInit');
        console.log(this.insuranceName);
        console.log(this.insuranceType);
        console.log(this.imageAsB64);
        this.assetModel = {
            name: this.insuranceName,
            type: this.insuranceType,
            additional: {}
        };
        console.log(this.assetModel);
        // Defines the ordering of the Forms, which should be filled and the sizes of the scan area in the camera.
        switch (this.assetModel.type) {
            case Asset.TypeEnum.Gesetzliche:
                const insuranceNumber1Form = new CustomForm(ScanForms.InsuranceNumber, 0.7 + ' ' + 0.1, this.insuranceNumberFormGroup);
                const addressForm = new CustomForm(ScanForms.Address, 0.7 + ' ' + 0.2, this.addressFormGroup);
                const pensionInformationForm = new CustomForm(
                    ScanForms.PensionInfoLegal,
                    0.6 + ' ' + 0.3,
                    this.pensionInformationFormGroup);
                this.customForms = [pensionInformationForm];
                break;
            case Asset.TypeEnum.Betriebliche:
                break;
            case Asset.TypeEnum.Riester:
                const addressForm2 = new CustomForm(ScanForms.Address, 0.7 + ' ' + 0.2, this.addressFormGroup);
                const pensionInformation4Form = new CustomForm(
                    ScanForms.PensionInfoRiester,
                    0.4 + ' ' + 0.7,
                    this.pensionInformationFormGroup);
                this.customForms = [pensionInformation4Form];
                break;
            case Asset.TypeEnum.Sonstige:
        }
        this.setCurrentIndex(0);
    }

    ngAfterViewInit(): void {
        console.log('AddComponentAfterViewInit');
        this.cd.markForCheck();
    }

    closeModal(): void {
        this.dialogRef.close();
    }

    private setCurrentIndex(index: number): void {
        this.currentIndex = index;
        if (this.customForms !== undefined &&
            this.customForms[this.currentIndex].getFormGroup() === this.pensionInformationFormGroup) {
            this.changeRequiredFields(this.customForms[this.currentIndex]);
        }
    }

    /**
     * This method proceeds the user to take the next photo
     */
    public takeNextPhoto(): void {
        this.setCurrentIndex(++this.currentIndex);
        this.startAbbyy();
    }

    /**
     * This method makes the user take the complete photo of a certain insurance
     */
    private takePhoto(): void {
        // this.camera.getPicture({
        //     quality: 50,
        //     destinationType: this.camera.DestinationType.FILE_URI,
        //     encodingType: this.camera.EncodingType.PNG,
        //     mediaType: this.camera.MediaType.PICTURE
        // }).then((imageData) => {
        //     // imageData is either a base64 encoded string or a file URI
        //     // If it's base64 (DATA_URL):
        //     this.imageAsB64.set(++this.photoIndex, imageData);
        //     this.cd.markForCheck();
        // }, (err) => {
        //     console.error(err);
        // });
    }

    public async deletePhoto(index: number): Promise<void> {
        // const alert = await this.alertCtrl.create( {
        //     header: this.translate.instant('ADD.DELETE_PHOTO_HDR', {
        //         photo_name: `Seite #${index}`
        //     }),
        //     message: this.translate.instant('ADD.DELETE_PHOTO_MSG', {
        //         photo_name: `Seite #${index}`
        //     }),
        //     buttons: [{
        //             text: this.translate.instant('GENERAL.NO_BTN'),
        //             role: 'cancel',
        //         } as AlertButton,
        //         {
        //             text: this.translate.instant('GENERAL.YES_BTN'),
        //             handler: () => {
        //                 this.imageAsB64.delete(index);
        //                 this.cd.markForCheck();
        //             }
        //         }
        //     ]
        // } as AlertOptions);
        // await alert.present();
    }

    /**
     * Method starts the scanning workflow, consisting of three steps:
     *  1. cleaning the error field.
     *  2. starting the camera for scan in the background
     *  3. showing the example pic for the user in the foreground
     * When the user closes the photo viewer, the camera will be in the front and the user can take the scan.
     */
    public startAbbyy(): void {
        this.ready = false;
        this.alertCtrl.create({
            header: this.translate.instant('ADD.SCAN_ALERT_HDR'),
            message: this.translate.instant('ADD.SCAN_ALERT_MSG'),
            buttons: [{
                text: this.translate.instant('ADD.SCAN_ALERT_SHOW_BTN'),
                handler: () => {
                    this.showExample();
                }
            },
                {
                    text: this.translate.instant('ADD.SCAN_ALERT_START_BTN'),
                    handler: () => {
                        console.log('Start camera for ocr scan. OCRSize: ' + this.customForms[this.currentIndex].getOcrSizes());
                        // this.abbyyRtr.startTextCapture({
                        //     selectableRecognitionLanguages: ['German'],
                        //     recognitionLanguages: ['German'],

                        //     licenseFileName: 'AbbyyRtrSdk.license',
                        //     isFlashlightVisible: true,
                        //     stopWhenStable: true,
                        //     areaOfInterest: (this.customForms[this.currentIndex].getOcrSizes()),
                        //     isStopButtonVisible: false,
                        // }).then((res: any) => this.fillForm(res))
                        //     .catch((error: any) => console.error(error));
                    }
                }]
        }).then(alert => alert.present());
    }

    /**
     * This method submits the user inputs to the backend database
     */
    public async submitInputs(): Promise<void> {
        await this.pageUtils.startLoading();
        console.log(this.assetModel);

        this.assetModel.timestamp = this.getDate().toString();
        if (this.yearCtrl.value !== '') {
            this.assetModel.additional.year = this.yearCtrl.value;
        }
        switch (this.assetModel.type) {
            case Asset.TypeEnum.Gesetzliche:
                if (this.insuranceNumberCtrl.value !== '') {
                    this.assetModel.additional.number = this.insuranceNumberCtrl.value;
                }
                if (this.titleCtrl.value !== '') {
                    this.assetModel.additional.user_title = this.titleCtrl.value;
                }
                if (this.nameCtrl.value !== '') {
                    this.assetModel.additional.user_fullname = this.nameCtrl.value;
                }
                if (this.streetCtrl.value !== '') {
                    this.assetModel.additional.user_street = this.streetCtrl.value;
                }
                if (this.cityCtrl.value !== '') {
                    this.assetModel.additional.user_city = this.cityCtrl.value;
                }
                if (this.fullRecCtrl.value !== '') {
                    this.assetModel.additional.full_rec = Number(this.fullRecCtrl.value);
                }
                if (this.currentPensionCtrl.value !== '') {
                    this.assetModel.additional.current_pension = Number(this.currentPensionCtrl.value);
                }
                if (this.extrapolatedPensionCtrl.value !== '') {
                    this.assetModel.additional.extrapolated_pension = Number(this.extrapolatedPensionCtrl.value);
                }
                break;
            case Asset.TypeEnum.Betriebliche:
                /*switch (this.insuranceModel.name) {
                    case 'BVV':
                        if (this.insuranceNumberCtrl.value !== '') {
                            this.insuranceModel.number = this.insuranceNumberCtrl.value;
                        }
                        if (this.currentPensionCtrl.value !== '') {
                            this.insuranceModel.current_pension = Number(this.currentPensionCtrl.value);
                        }
                        if (this.extrapolatedPensionCtrl.value !== '') {
                            this.insuranceModel.extrapolated_pension = Number(this.extrapolatedPensionCtrl.value);
                        }
                        if (this.extrapolatedPensionCtrl.value !== '') {
                            this.insuranceModel.occ_invalidity = Number(this.occInvalidityCtrl.value);
                        }
                        if (this.extrapolatedPensionCtrl.value !== '') {
                            this.insuranceModel.full_rec = Number(this.fullRecCtrl.value);
                        }
                        if (this.extrapolatedPensionCtrl.value !== '') {
                            this.insuranceModel.widow_pension = Number(this.widowPensionCtrl.value);
                        }
                }*/
                break;
            case Asset.TypeEnum.Riester:
                if (this.titleCtrl.value !== '') {
                    this.assetModel.additional.user_title = this.titleCtrl.value;
                }
                if (this.nameCtrl.value !== '') {
                    this.assetModel.additional.user_fullname = this.nameCtrl.value;
                }
                if (this.streetCtrl.value !== '') {
                    this.assetModel.additional.user_street = this.streetCtrl.value;
                }
                if (this.cityCtrl.value !== '') {
                    this.assetModel.additional.user_city = this.cityCtrl.value;
                }
                if (this.currentPensionCtrl.value !== '') {
                    this.assetModel.additional.current_capital = Number(this.currentPensionCtrl.value);
                }
                if (this.lastContributionsCtrl.value !== '') {
                    this.assetModel.additional.last_contributions = Number(this.lastContributionsCtrl.value);
                }
                if (this.lastAmortizationsCtrl.value !== '') {
                    this.assetModel.additional.last_amortizations = Number(this.lastAmortizationsCtrl.value);
                }
                if (this.lastReceivedBonusCtrl.value !== '') {
                    this.assetModel.additional.last_received_bonus = Number(this.lastReceivedBonusCtrl.value);
                }
                if (this.lastRefundedBonusCtrl.value !== '') {
                    this.assetModel.additional.last_refunded_bonus = Number(this.lastRefundedBonusCtrl.value);
                }
                if (this.bonusesCtrl.value !== '') {
                    this.assetModel.additional.bonuses = Number(this.bonusesCtrl.value);
                }
                if (this.contributionsCtrl.value !== '') {
                    this.assetModel.additional.contributions = Number(this.contributionsCtrl.value);
                }
        }
        console.log(this.assetModel);
        this.api.configuration.accessToken = await this.tokenService.get();
        this.api.configuration.withCredentials = true;

        this.api.usersUserIdAssetsPost(this.userId, this.assetModel, 'response').subscribe(
            async (response: HttpResponse<Asset>) => {
                console.log('before call stoploading!');
                await this.pageUtils.stopLoading();
                await this.uploadPhoto(response.body);
                this.closeModal();
                await this.playlistService.refreshAllAssets(this.userId);
            },
            async (error: HttpErrorResponse) => {
                console.log('before call stoploading!');
                await this.pageUtils.stopLoading();
                await this.pageUtils.apiErrorHandler(error, this.userId, this.authService.refreshToken());
            });
    }

    /**
     * This method uploads the complete photo of the insurance form
     * @param asset: The insurance the picture belongs to
     */
    private async uploadPhoto(asset: Asset): Promise<any> {
        // const base64Data = 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
        // console.log('imageAsB64: ', this.imageAsB64);
        // console.log(this.urltoFile(base64Data, 'testImageFile', 'image/*'));

        this.pageUtils.startLoading();
        this.urltoFile(this.imageAsB64, 'upload', 'image/*')
            .then(async (file) => {
                this.api.configuration.accessToken = await this.tokenService.get();
                this.api.configuration.withCredentials = true;
                this.api.usersUserIdAssetsAssetIdFilePost(this.userId, asset.id, file, 'response').subscribe(
                    async () => {
                        console.log('before call stoploading!');
                        await this.pageUtils.stopLoading();
                        console.log('File uploaded successfully');
                    },
                    async (error: HttpErrorResponse) => {
                        console.log('before call stoploading!');
                        await this.pageUtils.stopLoading();
                        await this.pageUtils.apiErrorHandler(error, this.userId, this.authService.refreshToken());
                    });

            });
    }

    dataURItoBlob(dataURI): Blob {
        const byteString = window.atob(dataURI);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          int8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([int8Array], { type: 'image/png' });    
        return blob;
     }

    urltoFile(url, filename, mimeType): Promise<File> {
        return (fetch(url)
            .then((res) => {
              return res.arrayBuffer();
            })
            .then((buf) => {
              return new File([buf], filename, { type : mimeType });
            })
        );
    }

    /**
     * This method displays the scan instructions
     */
    public async showInstructions(): Promise<void> {
        console.log('Show instructions.');
        let instructionText = '';
        switch (this.insuranceType) {
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
    }

    /**
     * This method returns the current date
     */
    private getDate(): any {
        const today = new Date();
        const dd = Number(today.getDate());
        const mm = Number(today.getMonth() + 1);
        const yyyy = Number(today.getFullYear()).toString();

        let d: string;
        if (dd < 10) {
            d = '0' + dd;
        } else {
            d = dd.toString();
        }

        let m: string;
        if (mm < 10) {
            m = '0' + mm;
        } else {
            m = mm.toString();
        }

        return (d + '.' + m + '.' + yyyy).toString();
    }

    /**
     * This method converts a scanned string to a number
     * @param scanLine: The line scanned
     * @param field: The input field
     */
    private convertScanToNumber(scanLine: string, field: string, error: string): any {
        let preparedScan;
        if (scanLine.indexOf(' ') !== -1) {
            preparedScan = scanLine
                .substring(0, scanLine.indexOf(' '))
                .replace('.', '')
                .replace(',', '.');
        } else {
            preparedScan = scanLine
                .replace('.', '')
                .replace(',', '.');
        }
        const num = Number(preparedScan);
        if (!isNaN(num)) {
            return num;
        } else {
            error.concat(this.translate.instant('ADD.NO_DECIMAL_VALUE_ERROR', {field: field}));
            return preparedScan;
        }
    }

    /**
     * Method builds the image name to show and triggers the showExampleImg function.
     */
    private showExample(): void {
        switch (this.assetModel.type) {
            case Asset.TypeEnum.Gesetzliche:
            case Asset.TypeEnum.Riester:
                console.log(this.customForms[this.currentIndex]);
                console.log(this.customForms[this.currentIndex].getType());
                console.log(this.customForms[this.currentIndex].getType().toString());
                this.showExampleImg(this.getExamplePic());
        }
    }

    /**
     * Method starts the photo viewer with the given image name.
     * @param img Name of the image which will be shown.
     */
    private showExampleImg(img: string): void {
        console.log('Start photo viewer for example image.');

        // this.photoViewer.show(img, '', {share: false});
    }

    /**
     * Method to fill the form from the scan result.
     *   Switch-Case the form which is currently progressed. Depending on this different reading methods are fulfilled.
     * @param res Result from the Abbyy Scan.
     */
    private async fillForm(res: any): Promise<void> {
        let error = '';
        // this.ocrResults[this.currentIndex] = res;
        console.log(res);
        if (res.resultInfo.userAction === 'Canceled') {
            error = error.concat(this.translate.instant('ADD.CANCELLED_SCAN_MSG'));
        } else {
            console.log(res.textLines);
            console.log(res.textLines.length);
            switch (this.customForms[this.currentIndex].getType()) {
                case ScanForms.InsuranceNumber:
                    switch (this.assetModel.type) {
                        case TypeEnum.Gesetzliche:
                            if (res.textLines.length === 2) {
                                const heading = res.textLines[0].text.toLocaleLowerCase();
                                console.log(res.textLines[0].text);
                                console.log(heading.includes('versicherung') || heading.includes('nummer'));
                                if (heading.includes('versicherung') || heading.includes('nummer')) {
                                    this.insuranceNumberCtrl.setValue(res.textLines[1].text);
                                } else {
                                    error = error.concat(this.translate.instant('ADD.NO_INSURANCE_NUMBER'));
                                }
                            } else {
                                error = error.concat(this.translate.instant('ADD.NO_INSURANCE_NUMBER'));
                            }
                            break;
                        case TypeEnum.Betriebliche:
                            if (res.textLines.length === 1) {
                                const line = res.textLines[0].text.toLocaleLowerCase();
                                const heading = line.substring(0, line.lastIndexOf(' '));
                                console.log(res.textLines[0].text);
                                console.log(heading.includes('versi') || heading.includes('erten') || heading.includes('nr.'));
                                if (heading.includes('versi') || heading.includes('erten') || heading.includes('nr.')) {
                                    this.insuranceNumberCtrl.setValue(line.substring(line.lastIndexOf(' ') + 1, line.length));
                                } else {
                                    error = error.concat(this.translate.instant('ADD.NO_INSURANCE_NUMBER'));
                                }
                            } else {
                                error = error.concat(this.translate.instant('ADD.NO_INSURANCE_NUMBER'));
                            }
                            break;
                    }
                    break;
                case ScanForms.Address:
                    if (res.textLines.length === 4) {
                        this.titleCtrl.setValue(res.textLines[0].text === 'Herr' ? 'm' : 'f');
                        this.nameCtrl.setValue(res.textLines[1].text);
                        this.streetCtrl.setValue(res.textLines[2].text);
                        this.cityCtrl.setValue(res.textLines[3].text);
                    } else if (res.textLines.length === 3) {
                        this.nameCtrl.setValue(res.textLines[0].text);
                        this.streetCtrl.setValue(res.textLines[1].text);
                        this.cityCtrl.setValue(res.textLines[2].text);
                    } else if (res.textLines.length > 4) {
                        error = error.concat(this.translate.instant('ADD.TOO_MUCH_ERROR'));
                    } else if (res.textLines.length < 3) {
                        error = error.concat(this.translate.instant('ADD.TOO_LITTLE_ERROR'));
                    }
                    break;
                case ScanForms.PensionInfoLegal:
                    this.fullRecCtrl.setValue(
                        this.convertScanToNumber(res.textLines[0].text, this.translate.instant('ADD.FULL_REC_LBL'), error));
                    this.currentPensionCtrl.setValue(
                        this.convertScanToNumber(res.textLines[1].text, this.translate.instant('ADD.CURRENT_PENSION_LBL'), error));
                    this.extrapolatedPensionCtrl.setValue(
                        this.convertScanToNumber(res.textLines[2].text, this.translate.instant('ADD.EXTRA_PENSION_LBL'), error));
                    break;
                case ScanForms.PensionInfoBvv1:
                    this.currentPensionCtrl.setValue(
                        this.convertScanToNumber(res.textLines[0].text, this.translate.instant('ADD.CURRENT_PENSION_LBL'), error));
                    this.extrapolatedPensionCtrl.setValue(
                        this.convertScanToNumber(res.textLines[1].text, this.translate.instant('ADD.EXTRA_PENSION_LBL'), error));
                    break;
                case ScanForms.PensionInfoBvv2:
                    this.occInvalidityCtrl.setValue(
                        this.convertScanToNumber(res.textLines[0].text, this.translate.instant('ADD.OCC_INVALIDITY_LBL'), error));
                    this.fullRecCtrl.setValue(
                        this.convertScanToNumber(res.textLines[1].text, this.translate.instant('ADD.FULL_REC_LBL'), error));
                    this.widowPensionCtrl.setValue(
                        this.convertScanToNumber(res.textLines[2].text, this.translate.instant('ADD.WIDOW_PENSION_LBL'), error));
                    break;
                case ScanForms.PensionInfoRiester:
                    if (res.textLines.length > 3) {
                        this.lastContributionsCtrl.setValue(
                            this.convertScanToNumber(res.textLines[0].text, this.translate.instant('ADD.LAST_CONTRIBUTIONS_LBL'), error));
                        if (res.textLines.length > 4) {
                            // TODO sehr vereinfachend, fehlt refunded bonus und last amortizations
                            let received = 0;
                            for (let i = 1; i < res.textLines.length - 3; i++) {
                                received += this.convertScanToNumber(res.textLines[i].text, 'Grundzulage/Kinderzulage', error);
                            }
                            this.lastReceivedBonusCtrl.setValue(received);
                        }
                    }
                    this.bonusesCtrl.setValue(
                        this.convertScanToNumber(
                            res.textLines[res.textLines.length - 3].text, this.translate.instant('ADD.BONUSES_LBL'), error));
                    this.contributionsCtrl.setValue(
                        this.convertScanToNumber(
                            res.textLines[res.textLines.length - 2].text, this.translate.instant('ADD.CONTRIBUTIONS_LBL'), error));
                    this.currentPensionCtrl.setValue(
                        this.convertScanToNumber(
                            res.textLines[res.textLines.length - 1].text, this.translate.instant('ADD.CURRENT_PENSION_LBL'), error));
                    break;
            }
        }
        if (error !== '') {
            await this.pageUtils.showToast(error);
        } else {
            console.log('No error, everything fine');
        }
    }

    /**
     * This method validates the data passed in
     * @param form: The input form used
     */
    private changeRequiredFields(form: CustomForm): void {
        if (form.getFormGroup() === this.pensionInformationFormGroup) {
            console.log('Change Required Fields for pensionInformationFormGroup');
            for (const formControl of this.pensionInfoCtrls) {
                formControl.clearValidators();
            }
            switch (form.getType()) {
                case ScanForms.PensionInfoLegal:
                    this.fullRecCtrl.setValidators(Validators.compose([Validators.min(0), Validators.max(9999.99)]));
                    this.currentPensionCtrl.setValidators(Validators.compose([
                        Validators.min(0),
                        Validators.max(9999.99),
                        Validators.required
                    ]));
                    this.extrapolatedPensionCtrl.setValidators(Validators.compose([
                        Validators.min(0),
                        Validators.max(9999.99),
                        Validators.required
                    ]));
                    break;
                case ScanForms.PensionInfoBvv1:
                    this.currentPensionCtrl.setValidators(Validators.compose([
                        Validators.min(0),
                        Validators.max(9999.99),
                        Validators.required
                    ]));
                    this.extrapolatedPensionCtrl.setValidators(Validators.compose([
                        Validators.min(0),
                        Validators.max(9999.99)
                    ]));
                    break;
                case ScanForms.PensionInfoBvv2:
                    this.occInvalidityCtrl.setValidators(
                        Validators.compose([Validators.min(0),
                            Validators.max(9999.99),
                            Validators.required
                        ]));
                    this.fullRecCtrl.setValidators(
                        Validators.compose([
                            Validators.min(0),
                            Validators.max(9999.99)
                        ]));
                    break;
                case ScanForms.PensionInfoRiester:
                    this.currentPensionCtrl.setValidators(Validators.compose([
                        Validators.min(0),
                        Validators.max(999999.99),
                        Validators.required
                    ]));
            }
        }
    }

    public getInformationTitle(insuranceType: Asset.TypeEnum): string {
        switch (insuranceType) {
            case 'Gesetzliche':
                return this.translate.instant('ADD.INFO_GESETZLICHE');
            case 'Betriebliche':
                return this.translate.instant('ADD.INFO_BETRIEBLICHE');
            case 'Riester':
                return this.translate.instant('ADD.INFO_RIESTER');
            case 'Sonstige':
                return this.translate.instant('ADD.INFO_MISCELLANEOUS');
            default:
                return 'Rente';
        }
    }

    public getExamplePic(): string {
        console.log('assetModel: ', this.assetModel);
        if (this.assetModel !== undefined) {
            switch (this.assetModel.type) {
                case 'Gesetzliche':
                case 'Riester':
                    const imgLocation = 'https://ocrfsstorage.blob.core.windows.net/pub-images/'
                        + this.assetModel.type.replace(' ', '_')
                        + this.customForms[this.currentIndex].getType() + '.png';
                    console.log(imgLocation);
                    return imgLocation;
                default:
                    return '';
            }
        }
    }
}

class CustomForm {

    private readonly type: ScanForms;
    private readonly ocrSizes: string;
    private readonly formGroup: FormGroup;

    constructor(type: ScanForms, ocrSizes: string, formGroup: FormGroup) {
        this.type = type;
        this.ocrSizes = ocrSizes;
        this.formGroup = formGroup;
    }

    /**
     * This method retrieves the ocr sizes
     */
    public getOcrSizes(): string {
        return this.ocrSizes;
    }

    /**
     * This method retrieves the type of scan form
     */
    public getType(): ScanForms {
        return this.type;
    }

    /**
     * This method retrieves the groud of scan form
     */
    public getFormGroup(): FormGroup {
        return this.formGroup;
    }
}

enum ScanForms {
    Address = 0,
    PensionInfoLegal,
    InsuranceNumber,
    PensionInfoBvv1,
    PensionInfoBvv2,
    PensionInfoRiester = 6
}

