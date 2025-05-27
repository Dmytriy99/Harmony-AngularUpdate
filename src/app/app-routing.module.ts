import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componenti/home/home.component';
import { PostComponent } from './componenti/post/post.component';
import { UsersComponent } from './componenti/users/users.component';
import { UserComponent } from './componenti/user/user.component';
import { PersonalUserComponent } from './componenti/personal-user/personal-user.component';
import { RegisterComponent } from './componenti/register/register.component';
import { isauthGuard } from './auth/auth.guard';
import { LoginComponent } from './componenti/login/login.component';
import { CommunityComponent } from './componenti/community/community.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [isauthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/posts' },
      { path: 'posts', canActivate: [isauthGuard], component: PostComponent },
      { path: 'users', canActivate: [isauthGuard], component: UsersComponent },
      { path: 'community', canActivate: [isauthGuard], component: CommunityComponent },
      {
        path: 'users/:id',
        canActivate: [isauthGuard],
        component: UserComponent,
        runGuardsAndResolvers: 'paramsChange'
      },
      {
        path: 'homeUser',
        canActivate: [isauthGuard],
        component: PersonalUserComponent,
      },
    ],
  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
  
})
export class AppRoutingModule {}
