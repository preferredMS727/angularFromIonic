import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
// import {Camera} from '@ionic-native/camera/ngx';
// import {AlertButton, AlertOptions} from '@ionic/core';
import TypeEnum = Asset.TypeEnum;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
