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

  private segredo = 'minha-chave-secreta'; // segredo compartilhado para JWS

  // ================== Função JWS pura ==================
  async criarToken(usuario: Usuario): Promise<string> {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      nome: usuario.nome,
      email: usuario.email,
      exp: Math.floor(Date.now() / 1000) + 3600 // expira em 1 hora
    };

    const encode = (obj: any) =>
      btoa(JSON.stringify(obj))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    const base64Header = encode(header);
    const base64Payload = encode(payload);
    const data = `${base64Header}.${base64Payload}`;
    const signature = await this.sha256Hmac(data, this.segredo);

    return `${data}.${signature}`;
  }

  private async sha256Hmac(msg: string, key: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const msgData = encoder.encode(msg);

    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const sig = await window.crypto.subtle.sign('HMAC', cryptoKey, msgData);
    const arr = Array.from(new Uint8Array(sig));
    return arr.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // ====================================================

  cadastrarUsuario() {
    if (this.senhaCadastro !== this.confirmaSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    const usuariosSalvos = localStorage.getItem('usuarios');
    const usuarios: Usuario[] = usuariosSalvos ? JSON.parse(usuariosSalvos) : [];

    if (usuarios.some(u => u.email === this.emailCadastro.trim())) {
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

  async loginUsuario() {
    const usuariosSalvos = localStorage.getItem('usuarios');
    if (!usuariosSalvos) {
      alert('Nenhum usuário cadastrado.');
      return;
    }

    const usuarios: Usuario[] = JSON.parse(usuariosSalvos);
    const usuario = usuarios.find(u => u.email === this.emailLogin.trim() && u.senha === this.senhaLogin);

    if (!usuario) {
      alert('E-mail ou senha incorretos.');
      this.limparLogin();
      return;
    }

    const token = await this.criarToken(usuario);
    this.salvarTokenNoCookie(token);
    this.router.navigate(['/catraca']);
    this.limparLogin();
  }

  salvarTokenNoCookie(token: string) {
    const expiracao = new Date(Date.now() + 3600 * 1000);
    document.cookie = `token=${token}; expires=${expiracao.toUTCString()}; path=/;`;
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
