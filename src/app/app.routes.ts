import { Routes } from '@angular/router';
import { HomePageComponent } from '../home-page/home-page.component';
import { ThreeByThreeComponent } from '../three-by-three/three-by-three.component';

export const routes: Routes = [
    {path: '', component: HomePageComponent, title:'home page'},
    {path: '3x3', component: ThreeByThreeComponent, title: '3x3 game'}
];
