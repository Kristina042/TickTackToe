import { Routes } from '@angular/router';
import { HomePageComponent } from '../home-page/home-page.component';
import { ThreeByThreeComponent } from '../three-by-three/three-by-three.component';
import { TenByTenComponent } from '../ten-by-ten/ten-by-ten.component';
import { FiveByFiveComponent } from '../five-by-five/five-by-five.component';
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { MultiplayerGameComponent } from '../multiplayer/multiplayer-game/multiplayer-game.component';
import { authorizedGuard } from '../guards/authorized.guard';

export const routes: Routes = [
    {path: '', component: HomePageComponent, title:'home page'},
    {path: '3x3', component: ThreeByThreeComponent, title: '3x3 game'},
    {path: '10x10', component: TenByTenComponent, title: '10x10 game'},
    {path: '5x5', component: FiveByFiveComponent, title: '5x5 game'},
    {path: 'register', component: RegisterComponent, title: 'registration'},
    {path: 'login', component: LoginComponent, title: 'login'},
    {path: 'multiplayer/:game_id/:game_type', component: MultiplayerGameComponent, canActivate: [authorizedGuard]},
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
