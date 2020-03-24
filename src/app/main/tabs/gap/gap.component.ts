import { Component, OnInit, ViewChild } from '@angular/core';
import { type } from 'os';
import {ProfileService} from '../../../services/profile.service';
import {User} from '../../../../api';
import { ApiAuthService } from '../../../services/auth.service';
import {PlaylistService} from '../../../services/playlist.service';
import {TranslateService} from '@ngx-translate/core';
import {Chart} from 'chart.js';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';
import {CurrencyPipe} from '@angular/common';
import {PageUtilsService} from '../../../services/page-utils.service';
import { PageChangeActionService } from '../../../services/page-change-action.service';

@Component({
  selector: 'app-gap',
  templateUrl: './gap.component.html',
  styleUrls: ['./gap.component.scss']
})
export class GapComponent implements OnInit {
    @ViewChild('barCanvas', { static: false }) barCanvas;
    public profile: User;
    public pension: number;
    private shares = 0;
    private bonds = 0;
    public capitalPension: number;
    public insurancePension: number;

    constructor(
        private profileService: ProfileService,
        public authService: ApiAuthService,
        private playlistService: PlaylistService,
        public translate: TranslateService,
        private currencyPipe: CurrencyPipe,
        public pageUtils: PageUtilsService,
        private pageChangeAction: PageChangeActionService
    ) {
        this.pageChangeAction.getLogoText('/tabs/gap');   
    }

    async ngOnInit(): Promise<void> {
        const userId = await this.authService.getUserId();
        await this.getProfile(userId);
        console.log('ngOnInit!');
        await this.getInsurances(userId);
        setTimeout(async () => {
            await this.createBarChart();
        }, 500);
    }

    public absolute(num: number): number {
        return Math.abs(num);
    }

    public async getProfile(userId: number): Promise<void> {
        this.profile = await this.profileService.getProfile(userId);
        console.log('useID: ', this.profile);
    }

    public async getInsurances(userId: number): Promise<void> {
        const assets = await this.playlistService.getAssets(userId);
        await this.setPension(userId);
        const result = await this.playlistService.getShareBondPlan(userId, assets);
        this.shares = result[0];
        this.bonds = result[1];
    }

    private async setPension(userId: number): Promise<void> {
        console.log('useID: ', userId);
        this.pension = (await this.playlistService.getFullPension(userId)).get(80);
        this.capitalPension = (await this.playlistService.getCapitalPension(userId)).get(80);
        this.insurancePension = (await this.playlistService.getInsurancePension(userId)).get(80);
    }

    public createBarChart(): any {
        // Setting colors for the playlist graph
        const colorShares = 'rgb(0, 112, 192)';
        const colorBonds = 'rgb(112, 48, 160)';

        let data = {};
        // Specifying the data
        data = {
            labels: ['Mon. Investition'],
            datasets: [
                {
                    data: [this.shares],
                    backgroundColor: [colorShares],
                    label: this.translate.instant('GAP.SHARE_TEXT')
                },
                {
                    data: [this.bonds],
                    backgroundColor: [colorBonds],
                    label: this.translate.instant('GAP.BONDS_TEXT')
                }
            ]
        };

        // Specifying the options
        const options = {
            plugins: {
                datalabels: {
                    display: true,
                    color: '#ffffff',
                    formatter: (value, context) => {
                        return this.currencyPipe.transform(value, 'EUR');
                    }
                }
            },
            title: {
                display: false
            },
            legend: {
                display: true
            },
            tooltips: {
                callbacks: {
                    label: (tooltipItem, data1) => {
                        let label = data1.datasets[tooltipItem.datasetIndex].label || '';

                        if (label) {
                            label += ': ';
                        }
                        label += this.currencyPipe.transform(tooltipItem.xLabel, 'EUR');
                        return label;
                    }
                }
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: true
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }],
                yAxes: [
                    {
                        display: false,
                        gridLines: {
                            display: true
                        }
                    }
                ]
            }
        };

        const chart = new Chart(this.barCanvas.nativeElement, {
            plugins: [ChartDataLabels],
            data: data,
            options: options,
            type: 'horizontalBar'
        } as Chart.ChartConfiguration);
    }

}
