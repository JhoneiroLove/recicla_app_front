import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { UserDashboardComponent } from './pages/user/user-dashboard/user-dashboard.component';
import { ListRecompensaComponent } from './pages/list-recompensa/list-recompensa.component';
import { VHistorialComponent } from './pages/v-historial/v-historial.component';
import { RActividadComponent } from './pages/r-actividad/r-actividad.component';
import { ParticipanteGuard } from './service/auth-guard.guard';
import { VerCatalogoComponent } from './pages/ver-catalogo/ver-catalogo.component';
import { AdministradorGuard } from './service/administrador.guard';
import { RegistrarRecompensaComponent } from './pages/registrar-recompensa/registrar-recompensa.component';
import { VerRecompensaComponent } from './pages/ver-recompensa/ver-recompensa.component';
import { RComunidadComponent } from './pages/r-comunidad/r-comunidad.component';
import { VerComunidadComponent } from './pages/ver-comunidad/ver-comunidad.component';
import { RResiduoComponent } from './pages/r-residuo/r-residuo.component';
import { VerResiduoComponent } from './pages/ver-residuo/ver-residuo.component';
import { VerEstadisticaComponent } from './pages/ver-estadistica/ver-estadistica.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { PanelValidacionOngComponent } from './pages/panel-validacion-ong/panel-validacion-ong.component';
import { OngDashboardComponent } from './pages/ong/ong-dashboard/ong-dashboard.component';
import { OngGuard } from './service/ong.guard';
import { CentroDashboardComponent } from './pages/centro/centro-dashboard/centro-dashboard.component';
import { CentroAcopioGuard } from './service/centro-acopio.guard';
import { RegistrarActividadCentroComponent } from './pages/centro/registrar-actividad-centro/registrar-actividad-centro.component';
import { HistorialCentroComponent } from './pages/centro/historial-centro/historial-centro.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'signup',
    component: SignupComponent,
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [AdministradorGuard],
    children: [
      {
        path: 'registrar-recompensa',
        component: RegistrarRecompensaComponent,
      },
      {
        path: 'registrar-residuo',
        component: RResiduoComponent,
      },
      {
        path: 'ver-residuo',
        component: VerResiduoComponent,
      },
      {
        path: 'ver-recompensa',
        component: VerRecompensaComponent,
      },
      {
        path: 'perfil',
        component: PerfilComponent,
      },
    ],
  },
  {
    path: 'user',
    component: UserDashboardComponent,
    canActivate: [ParticipanteGuard],
    children: [
      {
        path: 'registrar-actividad',
        component: RActividadComponent,
      },
      {
        path: 'ver-historial',
        component: VHistorialComponent,
      },
      {
        path: 'ver-catalogo',
        component: VerCatalogoComponent,
      },
      {
        path: 'ver-recompensa',
        component: VerRecompensaComponent,
      },
      {
        path: 'crear-comunidad',
        component: RComunidadComponent,
      },
      {
        path: 'ver-comunidad',
        component: VerComunidadComponent,
      },
      {
        path: 'ver-estadistica',
        component: VerEstadisticaComponent,
      },
      {
        path: 'perfil',
        component: PerfilComponent,
      },
    ],
  },
  {
    path: 'ong',
    component: OngDashboardComponent,
    canActivate: [OngGuard],
    children: [
      {
        path: 'validacion-ong',
        component: PanelValidacionOngComponent,
      },
      {
        path: 'perfil',
        component: PerfilComponent,
      },
    ],
  },
  {
    path: 'centro',
    component: CentroDashboardComponent,
    canActivate: [CentroAcopioGuard],
    children: [
      {
        path: 'registrar-actividad',
        component: RegistrarActividadCentroComponent,
      },
      {
        path: 'historial',
        component: HistorialCentroComponent,
      },
      {
        path: 'perfil',
        component: PerfilComponent,
      },
    ],
  },
  {
    path: 'list-recompensa',
    component: ListRecompensaComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
