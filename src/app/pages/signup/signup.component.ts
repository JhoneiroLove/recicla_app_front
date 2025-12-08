import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './../../service/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Web3Service } from '../../service/web3.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm!: FormGroup;
  walletAddress: string = '';
  isConnectingWallet: boolean = false;
  walletConnected: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private web3Service: Web3Service,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z ]+$/),
          Validators.minLength(3),
          Validators.maxLength(12),
        ],
      ],
      edad: [
        '',
        [Validators.required, Validators.min(16), Validators.max(100)],
      ],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      username: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(9)],
      ],
      password: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      walletAddress: [
        '',
        [Validators.required, Validators.pattern(/^0x[a-fA-F0-9]{40}$/)],
      ],
    });

    // Escuchar cambios de cuenta en MetaMask
    this.web3Service.onAccountsChanged((accounts: string[]) => {
      if (accounts.length === 0) {
        this.handleWalletDisconnected();
      } else if (accounts[0] !== this.walletAddress) {
        this.handleWalletChanged(accounts[0]);
      }
    });

    // Escuchar cambios de red
    this.web3Service.onChainChanged((chainId: string) => {
      this.handleNetworkChanged(chainId);
    });
  }

  ngOnDestroy(): void {
    this.web3Service.removeAllListeners();
  }

  async connectWallet(): Promise<void> {
    this.isConnectingWallet = true;

    try {
      const address = await this.web3Service.connectAndSwitchNetwork();

      this.walletAddress = address;
      this.walletConnected = true;
      this.signupForm.patchValue({ walletAddress: address });

      this.snack.open('Wallet conectada exitosamente', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['success-snackbar'],
      });
    } catch (error: any) {
      console.error('Error conectando wallet:', error);
      this.walletConnected = false;
      this.walletAddress = '';
      this.signupForm.patchValue({ walletAddress: '' });
    } finally {
      this.isConnectingWallet = false;
    }
  }

  private handleWalletDisconnected(): void {
    this.walletConnected = false;
    this.walletAddress = '';
    this.signupForm.patchValue({ walletAddress: '' });

    this.snack.open(
      'Wallet desconectada. Por favor, vuelve a conectar',
      'Cerrar',
      {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['warning-snackbar'],
      }
    );
  }

  private handleWalletChanged(newAddress: string): void {
    this.walletAddress = newAddress;
    this.signupForm.patchValue({ walletAddress: newAddress });

    this.snack.open('Cuenta de wallet cambiada', 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['info-snackbar'],
    });
  }

  private async handleNetworkChanged(chainId: string): Promise<void> {
    const isCorrect = chainId === '0x7a69'; // Hardhat Local (31337)

    if (!isCorrect && this.walletConnected) {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Red cambiada',
        text: 'Has cambiado a una red diferente. ¿Deseas volver a Hardhat Local?',
        showCancelButton: true,
        confirmButtonText: 'Cambiar red',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        try {
          await this.web3Service.switchToActiveNetwork();
        } catch (error) {
          console.error('Error cambiando de red:', error);
        }
      }
    }
  }

  formSubmit() {
    if (this.signupForm.invalid) {
      this.snack.open(
        'Por favor, complete los campos requeridos correctamente',
        'Aceptar',
        {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        }
      );
      return;
    }

    if (!this.walletConnected || !this.walletAddress) {
      this.snack.open(
        'Debes conectar tu wallet de MetaMask antes de registrarte',
        'Aceptar',
        {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        }
      );
      return;
    }

    this.userService.addUsuario(this.signupForm.value).subscribe(
      (data) => {
        Swal.fire({
          title: 'Usuario guardado',
          html: `
            <p>Usuario registrado con éxito en el sistema</p>
            <p><small>Wallet: ${this.walletAddress.substring(
              0,
              6
            )}...${this.walletAddress.substring(38)}</small></p>
          `,
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/login';
          }
        });
      },

      (error) => {
        let errorMessage = 'Ha ocurrido un error en el sistema !!';

        // Verifica si el mensaje de error contiene información sobre la entrada duplicada
        if (error.error && error.error.message) {
          const backendMessage = error.error.message;

          // Error de wallet duplicada
          if (backendMessage.includes('wallet ya está registrada')) {
            errorMessage =
              'Esta wallet ya está registrada en el sistema. Por favor, usa otra wallet de MetaMask.';
          }
          // Comprueba si el mensaje contiene "Duplicate entry"
          else {
            const duplicateEntryMatch = backendMessage.match(
              /Duplicate entry '(.+?)' for key '(.+?)'/
            );
            if (duplicateEntryMatch) {
              errorMessage = `Error: Algunos de los campos ingresados ya están registrados. Por favor, revise e intente nuevamente.`;
            }
          }
        }

        this.snack.open(errorMessage, 'Aceptar', {
          duration: 6000,
        });
      }
    );
  }
}
