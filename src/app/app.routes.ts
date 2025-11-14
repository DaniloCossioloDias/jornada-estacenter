import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { LiberacaoCatracaPage } from './pages/liberacao-catraca/liberacao-catraca.component';
import { AuthGuard } from './auth.guard';  // Importa o AuthGuard

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'catraca', 
    component: LiberacaoCatracaPage,
    canActivate: [AuthGuard]  // Protege a rota 'catraca' com o AuthGuard
  },
  { path: '**', redirectTo: 'login' }
];
