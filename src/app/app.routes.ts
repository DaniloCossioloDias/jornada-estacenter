import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { LiberacaoCatracaPage } from './pages/liberacao-catraca/liberacao-catraca.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'catraca', component: LiberacaoCatracaPage },
  { path: '**', redirectTo: 'login' }
];
