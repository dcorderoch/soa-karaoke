import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReproductorComponent } from './pages/reproductor/reproductor.component';
import { SongsComponent } from './pages/songs/songs.component';
import { EditComponent } from './pages/edit/edit.component';
import { AddComponent } from './pages/add/add.component';
import { LoginComponent } from './auth/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    ReproductorComponent,
    SongsComponent,
    EditComponent,
    AddComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
     MatButtonModule,
     MatFormFieldModule,
     MatInputModule,
     MatIconModule,
     FormsModule,
     BrowserAnimationsModule,
     FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
