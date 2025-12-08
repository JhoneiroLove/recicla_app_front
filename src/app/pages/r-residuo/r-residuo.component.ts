import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResiduoService } from '../../../app/service/residuo.service';
import { SidebarService } from '../../../app/service/sidebar.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-r-residuo',
  templateUrl: './r-residuo.component.html',
  styleUrls: ['./r-residuo.component.css']
})
export class RResiduoComponent implements OnInit {
  residuoForm: FormGroup;
  residuosExistentes: any[] = [];  // Para almacenar residuos existentes
  sidebarExpanded$: Observable<boolean>;

  constructor(
    private residuoService: ResiduoService,
    private sidebarService: SidebarService,
    private router: Router
  ) {
    this.sidebarExpanded$ = this.sidebarService.expanded$;
    this.residuoForm = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/),  // Solo letras y espacios
        Validators.maxLength(25)
      ]),
      descripcion: new FormControl('', [
        Validators.required,
        // Solo letras y espacios
        Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/),
        Validators.maxLength(30)  // Máximo 30 caracteres
      ]),

      tipo: new FormControl('', [Validators.required]),

      puntos: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),  // Solo números
        Validators.min(1)  // No se permiten números negativos ni cero
      ])
    });
  }

  ngOnInit(): void {
    // Cargar todos los residuos existentes al iniciar el componente
    this.cargarResiduosExistentes();
  }

  cargarResiduosExistentes(): void {
    // Llamamos al método del servicio para obtener todos los residuos (usando paginación si es necesario)
    this.residuoService.getAllResiduos({ page: 0, size: 1000 }).subscribe(
      (residuos) => {
        this.residuosExistentes = residuos.content || [];  // Almacenamos los residuos existentes
      },
      (error) => {
        console.error('Error al cargar los residuos existentes', error);
      }
    );
  }

  submitForm(): void {
    if (this.residuoForm.valid) {
      const nuevoResiduo = this.residuoForm.value;

      // Verificar si ya existe un residuo con el mismo nombre o descripción
      const { nombreDuplicado, descripcionDuplicada } = this.validarDuplicados(nuevoResiduo.nombre, nuevoResiduo.descripcion);

      if (nombreDuplicado) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ya existe un residuo con el mismo nombre.'
        });
      } else if (descripcionDuplicada) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ya existe un residuo con la misma descripción.'
        });
      } else {
        // Si no hay duplicado, procedemos con el registro
        this.registrarResiduo(nuevoResiduo);
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor, completa todos los campos del formulario.'
      });
    }
  }

  validarDuplicados(nombre: string, descripcion: string): { nombreDuplicado: boolean; descripcionDuplicada: boolean } {
    const nombreDuplicado = this.residuosExistentes.some(
      (residuo) => residuo.nombre.toLowerCase() === nombre.toLowerCase()
    );

    const descripcionDuplicada = this.residuosExistentes.some(
      (residuo) => residuo.descripcion.toLowerCase() === descripcion.toLowerCase()
    );

    return { nombreDuplicado, descripcionDuplicada };
  }

  registrarResiduo(residuo: any): void {
    this.residuoService.addResiduo(residuo).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: '¡Residuo registrado!',
          text: 'El residuo ha sido registrado exitosamente.'
        });
        this.onReset();  // Limpiar el formulario después del registro exitoso
        this.cargarResiduosExistentes();  // Actualizamos la lista de residuos después del registro
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error al registrar el residuo.'
        });
      }
    );
  }

  onReset(): void {
    this.residuoForm.reset();
  }

  volver(): void {
    this.router.navigate(['/admin/ver-residuo']);
  }
}
