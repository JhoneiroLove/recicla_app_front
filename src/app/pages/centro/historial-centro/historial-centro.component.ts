import { Component, OnInit } from '@angular/core';
import { ReActividadService } from 'src/app/service/re-actividad.service';
import { ResiduoService } from 'src/app/service/residuo.service';
import { LoginService } from 'src/app/service/login.service'; // AGREGAR
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Residuo } from 'src/app/Modelo/residuo';

@Component({
  selector: 'app-historial-centro',
  templateUrl: './historial-centro.component.html',
  styleUrls: ['./historial-centro.component.css']
})
export class HistorialCentroComponent implements OnInit {
  actividades = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['nombre', 'cantidad', 'residuo', 'puntosGanados', 'estudiante', 'fecha'];

  filtroNombre: string = '';
  filtroResiduo: string = '';
  ordenCantidad: string = '';
  residuosDisponibles: Residuo[] = [];
  actividadesOriginal: any[] = [];
  mostrarFiltros: boolean = true;

  constructor(
    private reActividadService: ReActividadService,
    private residuoService: ResiduoService,
    private loginService: LoginService // AGREGAR
  ) { }

  ngOnInit(): void {
    // VERIFICAR TOKEN Y ROL ANTES DE CARGAR
    this.verificarAutenticacion();
    this.cargarResiduos();
    this.cargarHistorial();
  }

  cargarResiduos(): void {
    console.log('🔄 Cargando tipos de residuos...');
    this.residuoService.listarResiduosPublico().subscribe(
      (data) => {
        console.log('✅ Residuos cargados:', data);
        this.residuosDisponibles = Array.isArray(data) ? data : (data.content || []);
      },
      (error) => {
        console.error('❌ Error con endpoint público, intentando con paginación...');
        this.residuoService.getAllResiduos({ page: 0, size: 1000 }).subscribe(
          (data) => {
            console.log('✅ Residuos con paginación:', data);
            this.residuosDisponibles = data.content || [];
          },
          (error2) => {
            console.error('❌ Error al cargar residuos:', error2);
          }
        );
      }
    );
  }

  verificarAutenticacion(): void {
    console.log('🔍 === VERIFICACIÓN DE AUTENTICACIÓN ===');

    const token = this.loginService.getToken();
    const role = this.loginService.getUserRole();
    const userDetails = this.loginService.getUserDetails();

    console.log('Token existe:', !!token);
    console.log('Token length:', token?.length);
    console.log('Role:', role);
    console.log('User Details:', userDetails);

    if (!token) {
      console.error('❌ NO HAY TOKEN');
      Swal.fire({
        title: 'Sin autenticación',
        text: 'Por favor inicia sesión nuevamente',
        icon: 'error'
      });
      return;
    }

    if (role !== 'CENTRO_ACOPIO') {
      console.error('❌ ROL INCORRECTO:', role);
      Swal. fire({
        title: 'Acceso denegado',
        text: `Tu rol es "${role}", pero se requiere "CENTRO_ACOPIO"`,
        icon: 'error'
      });
      return;
    }

    console.log('✅ Autenticación correcta - Role: CENTRO_ACOPIO');
  }

  cargarHistorial(): void {
    console.log('🔄 Cargando historial del centro de acopio...');

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    console.log('📦 Estado de localStorage:');
    console.log('  - Token:', token ?  `PRESENTE (${token.length} chars)` : 'AUSENTE');
    console.log('  - Role:', role);

    // Mostrar primeros y últimos caracteres del token
    if (token) {
      console.log('  - Token (inicio):', token.substring(0, 50) + '...');
      console.log('  - Token (fin):', '...' + token.substring(token.length - 20));
    }

    this.reActividadService.obtenerHistorialCentroAcopio(). subscribe(
      (response) => {
        console.log('✅ Historial Centro recibido:', response);
        this. actividades.data = response || [];
        this.actividadesOriginal = [...(response || [])];

        if (this. actividades.data.length === 0) {
          console.log('ℹ️ No hay entregas registradas');
        }
      },
      (error) => {
        console.error('❌ === ERROR COMPLETO ===');
        console.error('Status:', error.status);
        console.error('StatusText:', error.statusText);
        console.error('Message:', error.message);
        console.error('Error body:', error.error);
        console.error('Headers:', error.headers);
        console.error('URL:', error.url);

        if (error.status === 403) {
          Swal.fire({
            title: 'Acceso Denegado (403)',
            html: `
              <p><strong>El backend está rechazando tu solicitud. </strong></p>
              <p>Posibles causas:</p>
              <ul style="text-align: left;">
                <li>El endpoint requiere un rol diferente</li>
                <li>La configuración de seguridad del backend no permite el acceso</li>
                <li>El token no tiene los permisos correctos</li>
              </ul>
              <p><strong>Tu rol actual:</strong> ${role}</p>
            `,
            icon: 'error',
            width: 600
          });
        } else if (error.status === 401) {
          Swal.fire({
            title: 'No autorizado (401)',
            text: 'Tu sesión ha expirado o el token es inválido. Por favor inicia sesión nuevamente.',
            icon: 'warning'
          });
        } else if (error.status === 0) {
          Swal.fire({
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:8080',
            icon: 'error'
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: `No se pudo cargar el historial (Error ${error.status})`,
            icon: 'error'
          });
        }
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filtroNombre = filterValue.trim().toLowerCase();
    this.applyFilters();
  }

  applyResiduoFilter(event: any) {
    this.filtroResiduo = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  applyCantidadSort(event: any) {
    this.ordenCantidad = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  toggleOrdenCantidad() {
    if (this.ordenCantidad === '' || this.ordenCantidad === 'todos') {
      this.ordenCantidad = 'desc';
    } else if (this.ordenCantidad === 'desc') {
      this.ordenCantidad = 'asc';
    } else {
      this.ordenCantidad = '';
    }
    this.applyFilters();
  }

  applyFilters() {
    this.actividades. filterPredicate = (data: any, filter: string) => {
      const nameFilter = data. nombre?.toLowerCase().includes(this. filtroNombre) || data. usuarioNombre?.toLowerCase().includes(this.filtroNombre);
      const residuoFilter = this.filtroResiduo === '' || data.residuoNombre === this.filtroResiduo;
      return nameFilter && residuoFilter;
    };

    this.actividades.filter = Math.random().toString();

    if (this.ordenCantidad === 'mayorMenor' || this.ordenCantidad === 'desc') {
      this.actividades.data = this.actividades. data.sort((a, b) => b.cantidad - a.cantidad);
    } else if (this.ordenCantidad === 'menorMayor' || this.ordenCantidad === 'asc') {
      this.actividades.data = this.actividades.data.sort((a, b) => a. cantidad - b.cantidad);
    } else if (this.ordenCantidad === 'todos' || this.ordenCantidad === '') {
      this.actividades.data = [...this.actividadesOriginal];
    }
  }

  exportarPDF(): void {
    const doc = new jsPDF();
    doc. setFontSize(14);
    doc.text('Historial de Entregas - Centro de Acopio', 10, 10);

    const actividadesFiltradas = this.actividades.filteredData;
    const body = actividadesFiltradas.map((actividad: any) => [
      actividad.nombre,
      actividad.cantidad,
      actividad.residuoNombre,
      actividad. puntosGanados,
      actividad.usuarioNombre,
      new Date(actividad.fecha).toLocaleString(),
    ]);

    const head = [['Nombre', 'Cantidad (kg)', 'Residuo', 'Puntos', 'Estudiante', 'Fecha']];

    (doc as any).autoTable({
      head: head,
      body: body,
      startY: 20,
    });

    doc.save('historial_entregas_centro.pdf');
  }

  exportarCSV(): void {
    const actividadesFiltradas = this.actividades.filteredData;
    const csvRows = [];

    const headers = ['Nombre', 'Cantidad', 'Residuo', 'Puntos', 'Estudiante', 'Fecha'];
    csvRows.push(headers.join(','));

    actividadesFiltradas.forEach((actividad: any) => {
      const row = [
        actividad.nombre,
        actividad.cantidad,
        actividad. residuoNombre,
        actividad.puntosGanados,
        actividad.usuarioNombre,
        new Date(actividad.fecha).toLocaleString(),
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'historial_entregas_centro.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
