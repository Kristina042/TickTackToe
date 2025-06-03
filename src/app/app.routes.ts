import { Routes } from '@angular/router';
import { HomePageComponent } from '../home-page/home-page.component';
import { ThreeByThreeComponent } from '../three-by-three/three-by-three.component';
import { TenByTenComponent } from '../ten-by-ten/ten-by-ten.component';

export const routes: Routes = [
    {path: '', component: HomePageComponent, title:'home page'},
    {path: '3x3', component: ThreeByThreeComponent, title: '3x3 game'},
    {path: '10x10', component: TenByTenComponent, title: '10x10 game'}
];
