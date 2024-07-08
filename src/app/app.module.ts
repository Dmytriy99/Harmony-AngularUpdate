import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './componenti/home/home.component';

import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientModule } from '@angular/common/http';
import { PostComponent } from './componenti/post/post.component';
import { PostUnicoComponent } from './componenti/post-unico/post-unico.component';
import { CommentiComponent } from './componenti/commenti/commenti.component';
import { CreateUserComponent } from './componenti/create-user/create-user.component';
import { LoginComponent } from './componenti/login/login.component';
import { PersonalUserComponent } from './componenti/personal-user/personal-user.component';
import { RegisterComponent } from './componenti/register/register.component';
import { UserComponent } from './componenti/user/user.component';
import { UsersComponent } from './componenti/users/users.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PostComponent,
    PostUnicoComponent,
    CommentiComponent,
    CreateUserComponent,
    LoginComponent,
    PersonalUserComponent,
    RegisterComponent,
    UserComponent,
    UsersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatDialogModule,
    MatListModule,
    HttpClientModule,
    MatPaginatorModule,
    MatRadioModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
