import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  constructor(private authService: AuthService,private router: Router) { }

  ngOnInit(): void {
  }
  login(): void {
    const user = { email: this.email, password: this.password };
    this.authService.login(user).subscribe(
      (response: any) => {
        // Si la connexion est réussie, stocker le token JWT et rediriger l'utilisateur
        this.authService.setToken(response.token);
        this.router.navigate(['/dashboard']);  // Rediriger vers une page protégée
      },
      (error) => {
        // Si l'authentification échoue, afficher un message d'erreur
        this.errorMessage = 'Email ou mot de passe incorrect';
      }
    );
  }
}
