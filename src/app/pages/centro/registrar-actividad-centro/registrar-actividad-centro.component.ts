import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReActividadService } from '../../../service/re-actividad.service';
import { ResiduoService } from '../../../service/residuo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Residuo } from '../../../Modelo/residuo';

@Component({
  selector: 'app-registrar-actividad-centro',
  templateUrl: './registrar-actividad-centro.component.html',
  styleUrls: ['./registrar-actividad-centro.component.css'],
})
export class RegistrarActividadCentroComponent implements OnInit {
  actividadForm: FormGroup;
  imagenArchivo: File | null = null;
  imageTouched: boolean = false;
  residuos: Residuo[] = [];

  constructor(
    private fb: FormBuilder,
    private reActividadService: ReActividadService,
    private residuoService: ResiduoService,
    private snack: MatSnackBar
  ) {
    this.actividadForm = this.fb.group({
      walletEstudiante: [
        '',
        [Validators.required, Validators.pattern(/^0x[a-fA-F0-9]{40}$/)],
      ],
      cantidad: [
        '',
        [
          Validators.required,
          Validators.min(0.1),
          Validators.pattern(/^[0-9]+(\.[0-9]+)?$/),
        ],
      ],
      nombreResiduo: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarResiduos();
  }

  cargarResiduos(): void {
    this.residuoService.getAllResiduos({}).subscribe(
      (data) => {
        this.residuos = data.content;
      },
      (error) => {
        console.log(error);
        this.snack.open('Error al cargar los residuos', 'Aceptar', {
          duration: 3000,
        });
      }
    );
  }

  onFileSelected(event: Event): void {
    this.imageTouched = true;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.imagenArchivo = input.files[0];
    }
  }

  escanearQR(): void {
    Swal.fire({
      title: 'Escanear QR del Estudiante',
      html: '<p>Aquí se integraría un lector de QR</p><p>Por ahora, ingresa la wallet manualmente</p>',
      icon: 'info',
    });
  }

  submitForm(): void {
    if (this.actividadForm.valid && this.imagenArchivo) {
      const formData = new FormData();
      formData.append(
        'walletEstudiante',
        this.actividadForm.value.walletEstudiante
      );
      formData.append('cantidad', this.actividadForm.value.cantidad.toString());
      formData.append('nombreResiduo', this.actividadForm.value.nombreResiduo);
      formData.append('image', this.imagenArchivo);

      Swal.fire({
        title: 'Registrando actividad...',
        text: 'Subiendo evidencia a IPFS y proponiendo en blockchain',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      this.reActividadService.registrarActividadCentro(formData).subscribe(
        (response) => {
          console.log(response);
          Swal.fire({
            title: '¡Éxito!',
            html: `
              <p>Actividad registrada correctamente</p>
              <p><strong>Estudiante:</strong> ${this.actividadForm.value.walletEstudiante}</p>
              <p><strong>Material:</strong> ${this.actividadForm.value.nombreResiduo}</p>
              <p><strong>Cantidad:</strong> ${this.actividadForm.value.cantidad} kg</p>
              <p class="text-warning">⏳ Esperando validación de 2 ONGs</p>
            `,
            icon: 'success',
          });
          this.onReset();
        },
        (error) => {
          console.log(error);
          let errorMessage = 'Ha ocurrido un error en el sistema';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          Swal.fire('Error', errorMessage, 'error');
        }
      );
    } else {
      this.imageTouched = true;
      Swal.fire(
        'Error',
        'Por favor, completa todos los campos y selecciona una imagen',
        'error'
      );
    }
  }

  onReset(): void {
    this.actividadForm.reset();
    this.imagenArchivo = null;
    this.imageTouched = false;
  }
}
