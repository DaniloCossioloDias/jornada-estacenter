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

    const usuariosSalvos = localStorage.getItem('usuarios');
    let usuarios: Usuario[] = usuariosSalvos ? JSON.parse(usuariosSalvos) : [];

    const existe = usuarios.some(u => u.email === this.emailCadastro.trim());
    if (existe) {
      alert('Já existe uma conta com este e-mail.');
      return;
    }

    const novoUsuario: Usuario = {
      nome: this.nome.trim(),
      email: this.emailCadastro.trim(),
      senha: this.senhaCadastro
    };

    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Cadastro realizado com sucesso!');
    this.limparCadastro();
  }

  loginUsuario() {
    const usuariosSalvos = localStorage.getItem('usuarios');
    if (!usuariosSalvos) {
      alert('Nenhum usuário cadastrado.');
      return;
    }

    const usuarios: Usuario[] = JSON.parse(usuariosSalvos);

    const usuario = usuarios.find(
      u => u.email === this.emailLogin.trim() && u.senha === this.senhaLogin
    );

    if (!usuario) {
      alert('E-mail ou senha incorretos.');
      this.limparLogin();
      return;
    }

    localStorage.setItem('usuarioLogado', usuario.nome);
    this.router.navigate(['/catraca']);

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
