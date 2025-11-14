import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  private segredo = 'minha-chave-secreta';

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Garantir que estamos no navegador
    if (typeof window === 'undefined') {
      // Se for SSR, apenas deixa passar (ou redireciona, se preferir)
      return true;
    }

    const token = this.getTokenFromCookie();
    if (!token) {
      this.redirecionarLogin();
      return false;
    }

    try {
      const [headerB64, payloadB64, signature] = token.split('.');
      if (!headerB64 || !payloadB64 || !signature) throw new Error('Token malformado');

      // Decodifica o payload
      const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      const decoded: any = JSON.parse(payloadJson);

      // Verifica expiração
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

  private getTokenFromCookie(): string | null {
    const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
    return match ? match[1] : null;
  }

  private redirecionarLogin() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    this.router.navigate(['/login']);
  }
}
