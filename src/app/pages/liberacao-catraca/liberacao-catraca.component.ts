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

  liberar() {
    this.adicionarRegistro('Liberado');
  }

  travar() {
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
    window.location.href = '/login';
  }
}
