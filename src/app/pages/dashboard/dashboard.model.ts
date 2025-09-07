// Chart data
export interface ChartType {
    chart?: any;
    plotOptions?: any;
    colors?: any;
    series?: any;
    fill?: any;
    dataLabels?: any;
    legend?: any;
    xaxis?: any;
    stroke?: any;
    labels?: any;
    markers?: any;
    yaxis?: any;
    tooltip?: any;
    grid?: any;
    title?: any;
    responsive?: any;
}

export interface DashboardSummary {
  total_places: number;
  occupied: number;
  free: number;
  occupancy_rate: number; // 0..100
  cameras: { id:number; name:string; online:boolean }[];
  revenues_today: number;
}

export interface Mouvement {
  immatricule: string;
  action: 'ENTREE' | 'SORTIE';
  place: number;
  parking: string;
  at: string; // ISO
}

export interface Series { labels: string[]; values: number[]; }



