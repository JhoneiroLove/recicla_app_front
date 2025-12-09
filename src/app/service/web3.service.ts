import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

// Configuración de Hardhat Local (para desarrollo)
const HARDHAT_LOCAL = {
  chainId: '0x7a69', // 31337 en hexadecimal
  chainName: 'Hardhat Local',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['http://127.0.0.1:8545'],
  blockExplorerUrls: [],
};

// Configuración de Sepolia Testnet (Ethereum)
const SEPOLIA_NETWORK = {
  chainId: '0xaa36a7', // 11155111 en hexadecimal
  chainName: 'Sepolia Testnet',
  nativeCurrency: {
    name: 'SepoliaETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://eth-sepolia.g.alchemy.com/v2/VQ_jKkFIWE-kn56xsm1Is'],
  blockExplorerUrls: ['https://sepolia.etherscan.io/'],
};

// Configuración de Polygon Amoy Testnet
const AMOY_NETWORK = {
  chainId: '0x13882', // 80002 en hexadecimal
  chainName: 'Polygon Amoy Testnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://rpc-amoy.polygon.technology/'],
  blockExplorerUrls: ['https://amoy.polygonscan.com/'],
};

// Red activa (cambiar según entorno)
// HARDHAT_LOCAL = Desarrollo local
// SEPOLIA_NETWORK = Testing en testnet de Ethereum
// AMOY_NETWORK = Testing en testnet de Polygon
const ACTIVE_NETWORK = SEPOLIA_NETWORK; // 🔥 Ahora usando Sepolia

declare global {
  interface Window {
    ethereum?: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  private ethereum: any;

  constructor() {
    this.ethereum = window.ethereum;
  }

  /**
   * Verifica si MetaMask está instalado
   */
  isMetaMaskInstalled(): boolean {
    return typeof this.ethereum !== 'undefined' && this.ethereum.isMetaMask;
  }

  /**
   * Solicita conexión a MetaMask
   */
  async connectWallet(): Promise<string> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error(
        'MetaMask no está instalado. Por favor, instale MetaMask para continuar.'
      );
    }

    try {
      // Solicitar acceso a la cuenta
      const accounts = await this.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No se pudo obtener ninguna cuenta de MetaMask');
      }

      return accounts[0];
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('Conexión rechazada por el usuario');
      }
      throw new Error('Error al conectar con MetaMask: ' + error.message);
    }
  }

  /**
   * Obtiene la red actual
   */
  async getCurrentChainId(): Promise<string> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask no está instalado');
    }

    try {
      const chainId = await this.ethereum.request({
        method: 'eth_chainId',
      });
      return chainId;
    } catch (error: any) {
      throw new Error('Error al obtener la red: ' + error.message);
    }
  }

  /**
   * Verifica si está en la red activa configurada
   */
  async isCorrectNetwork(): Promise<boolean> {
    const chainId = await this.getCurrentChainId();
    return chainId === ACTIVE_NETWORK.chainId;
  }

  /**
   * Cambia a la red activa configurada
   */
  async switchToActiveNetwork(): Promise<void> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask no está instalado');
    }

    try {
      // Intentar cambiar a la red activa
      await this.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ACTIVE_NETWORK.chainId }],
      });
    } catch (error: any) {
      // Si la red no está agregada (error 4902), agregarla
      if (error.code === 4902) {
        try {
          await this.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [ACTIVE_NETWORK],
          });
        } catch (addError: any) {
          throw new Error('Error al agregar la red: ' + addError.message);
        }
      } else if (error.code === 4001) {
        throw new Error('Cambio de red rechazado por el usuario');
      } else {
        throw new Error('Error al cambiar de red: ' + error.message);
      }
    }
  }

  /**
   * Valida el formato de una dirección Ethereum
   */
  isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Flujo completo: conectar wallet y verificar/cambiar a red activa
   */
  async connectAndSwitchNetwork(): Promise<string> {
    // 1. Verificar MetaMask
    if (!this.isMetaMaskInstalled()) {
      await Swal.fire({
        icon: 'warning',
        title: 'MetaMask no detectado',
        html: `
          <p>Para registrarte necesitas tener MetaMask instalado.</p>
          <p>Visita <a href="https://metamask.io/download/" target="_blank">metamask.io</a> para instalarlo.</p>
        `,
        confirmButtonText: 'Entendido',
      });
      throw new Error('MetaMask no instalado');
    }

    // 2. Conectar wallet
    let walletAddress: string;
    try {
      walletAddress = await this.connectWallet();
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: error.message,
        confirmButtonText: 'Aceptar',
      });
      throw error;
    }

    // 3. Verificar red
    const isCorrect = await this.isCorrectNetwork();

    if (!isCorrect) {
      // Mostrar diálogo para cambiar de red
      const result = await Swal.fire({
        icon: 'info',
        title: 'Red incorrecta',
        html: `
          <p>Actualmente estás en una red diferente.</p>
          <p>Necesitas cambiar a <strong>${ACTIVE_NETWORK.chainName}</strong> para continuar.</p>
        `,
        showCancelButton: true,
        confirmButtonText: `Cambiar a ${ACTIVE_NETWORK.chainName}`,
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        try {
          await this.switchToActiveNetwork();

          await Swal.fire({
            icon: 'success',
            title: 'Red cambiada',
            text: `Ahora estás conectado a ${ACTIVE_NETWORK.chainName}`,
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error: any) {
          await Swal.fire({
            icon: 'error',
            title: 'Error al cambiar de red',
            text: error.message,
            confirmButtonText: 'Aceptar',
          });
          throw error;
        }
      } else {
        throw new Error('Cambio de red cancelado por el usuario');
      }
    }

    return walletAddress;
  }

  /**
   * Escucha cambios de cuenta
   */
  onAccountsChanged(callback: (accounts: string[]) => void): void {
    if (this.ethereum) {
      this.ethereum.on('accountsChanged', callback);
    }
  }

  /**
   * Escucha cambios de red
   */
  onChainChanged(callback: (chainId: string) => void): void {
    if (this.ethereum) {
      this.ethereum.on('chainChanged', callback);
    }
  }

  /**
   * Desconectar listeners
   */
  removeAllListeners(): void {
    if (this.ethereum && this.ethereum.removeAllListeners) {
      this.ethereum.removeAllListeners();
    }
  }

  async addTokenToMetaMask(): Promise<boolean> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask no está instalado');
    }

    const tokenAddress = '0x6Ee68256eF29096e8Bc66c14494E5f58650488DD';
    const tokenSymbol = 'REC';
    const tokenDecimals = 18;

    try {
      const wasAdded = await this.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
          },
        },
      });

      return wasAdded;
    } catch (error: any) {
      throw new Error('Error al agregar token: ' + error.message);
    }
  }
}
