import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  email: string = '';
  name:string='';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  register(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    const user = { email: this.email, password: this.password };
    this.authService.register(user).subscribe(
      (response) => {
        // Après l'inscription réussie, rediriger vers la page de login
        this.router.navigate(['/login']);
      },
      (error) => {
        // Afficher une erreur si l'inscription échoue
        this.errorMessage = 'Erreur lors de l\'inscription';
      }
    );
  }
}
