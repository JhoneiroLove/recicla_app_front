import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NavbarComponent } from './components/navbar/navbar.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';

import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { UserDashboardComponent } from './pages/user/user-dashboard/user-dashboard.component';

import {
  AuthInterceptor,
  authInterceptorProviders,
} from './service/auth.interceptor';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

import { MatMenuModule } from '@angular/material/menu';
import { RActividadComponent } from './pages/r-actividad/r-actividad.component';
import { RComunidadComponent } from './pages/r-comunidad/r-comunidad.component';
import { VHistorialComponent } from './pages/v-historial/v-historial.component';
import { ListRecompensaComponent } from './pages/list-recompensa/list-recompensa.component';
import { CRecompensaComponent } from './pages/c-recompensa/c-recompensa.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SlidebarComponent } from './components/slidebar/slidebar.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { MatTableModule } from '@angular/material/table';
import { VerCatalogoComponent } from './pages/ver-catalogo/ver-catalogo.component';
import { RegistrarRecompensaComponent } from './pages/registrar-recompensa/registrar-recompensa.component';
import { SlidebarAdministradorComponent } from './components/slidebar-administrador/slidebar-administrador.component';
import { VerRecompensaComponent } from './pages/ver-recompensa/ver-recompensa.component';
import { VerComunidadComponent } from './pages/ver-comunidad/ver-comunidad.component';
import { RResiduoComponent } from './pages/r-residuo/r-residuo.component';
import { VerResiduoComponent } from './pages/ver-residuo/ver-residuo.component';

import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { VerEstadisticaComponent } from './pages/ver-estadistica/ver-estadistica.component';

import { NgChartsModule } from 'ng2-charts';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatSelectModule } from '@angular/material/select';
import { PanelValidacionOngComponent } from './pages/panel-validacion-ong/panel-validacion-ong.component';
import { OngDashboardComponent } from './pages/ong/ong-dashboard/ong-dashboard.component';
import { SlidebarOngComponent } from './components/slidebar-ong/slidebar-ong.component';
import { CentroDashboardComponent } from './pages/centro/centro-dashboard/centro-dashboard.component';
import { SlidebarCentroComponent } from './components/slidebar-centro/slidebar-centro.component';
import { RegistrarActividadCentroComponent } from './pages/centro/registrar-actividad-centro/registrar-actividad-centro.component';
import { HistorialCentroComponent } from './pages/centro/historial-centro/historial-centro.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SignupComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    UserDashboardComponent,
    RActividadComponent,
    RComunidadComponent,
    VHistorialComponent,
    ListRecompensaComponent,
    CRecompensaComponent,
    SlidebarComponent,
    WelcomeComponent,
    VerCatalogoComponent,
    RegistrarRecompensaComponent,
    SlidebarAdministradorComponent,
    VerRecompensaComponent,
    VerComunidadComponent,
    RResiduoComponent,
    VerResiduoComponent,
    VerEstadisticaComponent,
    PerfilComponent,
    FooterComponent,
    PanelValidacionOngComponent,
    OngDashboardComponent,
    SlidebarOngComponent,
    CentroDashboardComponent,
    SlidebarCentroComponent,
    RegistrarActividadCentroComponent,
    HistorialCentroComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    NgChartsModule,
    MatSelectModule,
    MatExpansionModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
