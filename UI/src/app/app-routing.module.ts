import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SongsComponent } from './pages/songs/songs.component';
import { ReproductorComponent } from './pages/reproductor/reproductor.component';
import { EditComponent } from './pages/edit/edit.component';
import { AddComponent } from './pages/add/add.component';
import { RegisterComponent } from './auth/register/register.component';

const routes: Routes = [
  {
    path: 'add',
    component: AddComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'songs',
    component: SongsComponent,
  },
  {
    path: 'song/:id',
    component: ReproductorComponent,
  },
  {
    path: 'edit/:id',
    component: EditComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '**',
    redirectTo: 'songs',
  },
  {
    path: '',
    redirectTo: 'songs',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
