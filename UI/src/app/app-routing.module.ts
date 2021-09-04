import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SongsComponent } from './pages/songs/songs.component';
import { ReproductorComponent } from './pages/reproductor/reproductor.component';



const routes: Routes = [{
  path: 'login',
  component: LoginComponent
},
{
  path: 'songs',
  component: SongsComponent
},
{
  path: 'song/:id',
  component: ReproductorComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
