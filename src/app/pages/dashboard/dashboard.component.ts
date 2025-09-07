import { Component, OnInit, OnDestroy } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";

import { walletOverview, investedOverview, marketOverview, walletlineChart, tradeslineChart, investedlineChart, profitlineChart, recentActivity, News, transactionsAll, transactionsBuy, transactionsSell } from './data';
import { ChartType } from './dashboard.model';
import { DashboardService } from './dashboard.service';
import { Mouvement, DashboardSummary, Series } from './dashboard.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
/**
 *  Dashboard Component
 */
export class DashboardComponent implements OnInit, OnDestroy {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  title!: string;
  dataSource!: Object;
  walletOverview!: ChartType;
  investedOverview!: ChartType;
  marketOverview!: ChartType;
  walletlineChart!: ChartType;
  tradeslineChart!: ChartType;
  investedlineChart!: ChartType;
  profitlineChart!: ChartType;
  recentActivity: any;
  News: any;
  transactionsAll: any;
  transactionsBuy: any;
  transactionsSell: any;
  num: number = 0;
  // Coin News Slider
  timelineCarousel: OwlOptions = {
    items: 1,
    loop: false,
    margin: 0,
    nav: false,
    navText: ["", ""],
    dots: true,
    responsive: {
      680: {
        items: 4
      },
    }
  }

  summary?: DashboardSummary;
  mouvements: Mouvement[] = [];
  occ?: Series;
  rev?: Series;

  private sub?: Subscription;

  constructor(private svc: DashboardService) {}

  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 2,
  };


  ngOnInit(): void {
    /**
     * BreadCrumb 
     */
    this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'Dashboard', active: true }
    ];

    /**
     * Fetches the data
     */
    this.fetchData();
    // this.refresh();
    // temps réel: préfixe la table des mouvements
    this.sub = this.svc.liveEvents()?.subscribe(ev => {
      this.mouvements = [{...ev}, ...this.mouvements].slice(0, 10);
      if (this.summary) {
        this.summary.occupied = ev.action === 'ENTREE' ? this.summary.occupied + 1 : this.summary.occupied - 1;
        this.summary.free = Math.max(this.summary.total_places - this.summary.occupied, 0);
        this.summary.occupancy_rate = Math.round((this.summary.occupied / this.summary.total_places) * 100);
      }
    });
  }

  // refresh() {
  //   forkJoin({
  //     summary: this.svc.summary(),
  //     mouvements: this.svc.mouvements(10),
  //     occ: this.svc.occupancy('day'),
  //     rev: this.svc.revenues('month')
  //   }).subscribe(({summary, mouvements, occ, rev}) => {
  //     this.summary = summary; this.mouvements = mouvements; this.occ = occ; this.rev = rev;
  //   });
  // }

  ngOnDestroy() { this.sub?.unsubscribe(); }

  /**
   * Fetches the data
   */
  private fetchData() {
    this.walletOverview = walletOverview;
    this.investedOverview = investedOverview;
    this.marketOverview = marketOverview;
    this.walletlineChart = walletlineChart;
    this.tradeslineChart = tradeslineChart;
    this.investedlineChart = investedlineChart;
    this.profitlineChart = profitlineChart;
    this.recentActivity = recentActivity;
    this.News = News;
    this.transactionsAll = transactionsAll;
    this.transactionsBuy = transactionsBuy;
    this.transactionsSell = transactionsSell;

    setTimeout(() => {
      let markerRoot = am5.Root.new("world-map");

      markerRoot.setThemes([am5themes_Animated.new(markerRoot)]);


      let markerChart = markerRoot.container.children.push(
        am5map.MapChart.new(markerRoot, {
          panX: "none",
          panY: "none",
          opacity: 1,
          projection: am5map.geoMercator(),

        })
      );

      markerChart.series.push(
        am5map.MapPolygonSeries.new(markerRoot, {
          geoJSON: am5geodata_worldLow,
          exclude: ["AQ"],
          fill: am5.color("rgb(222, 226, 232)"),
          stroke: am5.color("#fff"),
        })
      );

      // Create point series
      var pointSeries = markerChart.series.push(
        am5map.MapPointSeries.new(markerRoot, {})
      );

      pointSeries.bullets.push(function (_root, _series, dataItem: any) {
        return am5.Bullet.new(markerRoot, {
          sprite: am5.Circle.new(markerRoot, {
            radius: 6,
            stroke: am5.color("#fff"),
            strokeWidth: 5,
            strokeOpacity: 0.5,
            fill: am5.color(0x6266c4),
            fillOpacity: 1,
            cursorOverStyle: 'pointer',
          }),
        });
      });

      pointSeries.pushDataItem({ latitude: 31.9474, longitude: 35.2272 });
      pointSeries.pushDataItem({ latitude: 61.524, longitude: 105.3188 });
      pointSeries.pushDataItem({ latitude: 56.1304, longitude: -106.3468 });
      pointSeries.pushDataItem({ latitude: 71.7069, longitude: -42.6043 });

    }, 0);
  }
}