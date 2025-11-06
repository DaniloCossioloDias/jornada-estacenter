import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Usuario {
  nome: string;
  email: string;
  senha: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {

  constructor(private router: Router) {}

  nome = '';
  emailCadastro = '';
  senhaCadastro = '';
  confirmaSenha = '';

  emailLogin = '';
  senhaLogin = '';

  cadastrarUsuario() {
    if (this.senhaCadastro !== this.confirmaSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    const usuario: Usuario = {
      nome: this.nome.trim(),
      email: this.emailCadastro.trim(),
      senha: this.senhaCadastro
    };

    localStorage.setItem('usuario', JSON.stringify(usuario));
    alert('Cadastro realizado com sucesso!');
    this.limparCadastro();
  }

  loginUsuario() {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (!usuarioSalvo) {
      alert('Nenhum usuário cadastrado.');
      return;
    }

    const usuario: Usuario = JSON.parse(usuarioSalvo);

    if (this.emailLogin.trim() === usuario.email && this.senhaLogin === usuario.senha) {
      localStorage.setItem('usuarioLogado', usuario.nome);
      this.router.navigate(['/catraca']);
    } else {
      alert('E-mail ou senha incorretos.');
    }

    this.limparLogin();
  }

  limparCadastro() {
    this.nome = '';
    this.emailCadastro = '';
    this.senhaCadastro = '';
    this.confirmaSenha = '';
  }

  limparLogin() {
    this.emailLogin = '';
    this.senhaLogin = '';
  }
}
