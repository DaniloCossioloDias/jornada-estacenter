import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Registro {
  veiculo: string;
  funcionario: string;
  setor: string;
  horario: string;
  acao: 'Liberado' | 'Bloqueado';
}

@Component({
  selector: 'app-liberacao-catraca',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liberacao-catraca.html',
  styleUrls: ['./liberacao-catraca.scss']
})
export class LiberacaoCatracaPage {

  historico: Registro[] = [];
  usuarioLogado = '';
  private segredo = 'minha-chave-secreta';

  constructor() {
    if (typeof window !== 'undefined') {
      this.usuarioLogado = localStorage.getItem('usuarioLogado') || 'Desconhecido';
    }

    this.carregarHistorico();
  }

  gerarHorario(): string {
    return new Date().toLocaleTimeString();
  }

  gerarPlaca(): string {
    return 'ABC-0000';
  }

  adicionarRegistro(acao: 'Liberado' | 'Bloqueado') {
    const registro: Registro = {
      veiculo: this.gerarPlaca(),
      funcionario: this.usuarioLogado,
      setor: 'Administrativo',
      horario: this.gerarHorario(),
      acao
    };

    this.historico.unshift(registro);
    this.salvarHistorico();
  }

  // ================== Função para validar token ==================
  private validarToken(): boolean {
    if (typeof window === 'undefined') return false;

    const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
    const token = match ? match[1] : null;

    if (!token) {
      this.redirecionarLogin();
      return false;
    }

    try {
      const [_, payloadB64, __] = token.split('.');
      if (!payloadB64) throw new Error('Token malformado');

      const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      const decoded: any = JSON.parse(payloadJson);

      const agora = Math.floor(Date.now() / 1000);
      if (!decoded.exp || decoded.exp < agora) {
        console.warn('Token expirado');
        this.redirecionarLogin();
        return false;
      }

      return true;

    } catch (err) {
      console.error('Token inválido', err);
      this.redirecionarLogin();
      return false;
    }
  }

  private redirecionarLogin() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/login';
  }
  // ================================================================

  liberar() {
    if (!this.validarToken()) return; // verifica antes
    this.adicionarRegistro('Liberado');
  }

  travar() {
    if (!this.validarToken()) return; // verifica antes
    this.adicionarRegistro('Bloqueado');
  }

  salvarHistorico() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('historicoCatraca', JSON.stringify(this.historico));
    }
  }

  carregarHistorico() {
    if (typeof window !== 'undefined') {
      const salvo = localStorage.getItem('historicoCatraca');
      if (salvo) this.historico = JSON.parse(salvo);
    }
  }

  logout() {
    localStorage.removeItem('usuarioLogado');
    this.redirecionarLogin();
  }
}
