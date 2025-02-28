import { Router } from '@angular/router';
import { AuthService } from './../../Services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: any;
  users: any[] = [];  // Initialiser un tableau pour les utilisateurs
  private unsubscribe$ = new Subject<void>();  // Initialiser le Subject pour se désabonner

  constructor(private userService: UserService,
              private authService: AuthService,private router:Router) {}

              ngOnInit(): void {
                if (!this.authService.isAuthenticated()) {
                  console.log('L’utilisateur n’est pas connecté');
                  this.router.navigate(['/login']);  // Rediriger l'utilisateur vers la page de connexion
                } else {
                  const user = this.authService.currentUser;
                  console.log('ID de l’utilisateur:', user?.id);  // Vérifier l'ID
                }

                this.getUsers();  // Fetch users when the component loads
              }


  ngOnDestroy(): void {
    this.unsubscribe$.next();  // Signaler à tous les observables abonnés de se désabonner
    this.unsubscribe$.complete();  // Terminer l'observable
  }

  getUsers(): void {
    this.userService.getAllUsers().pipe(takeUntil(this.unsubscribe$)).subscribe(
      users => {
        this.users = users;
      },
      error => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    );
  }

  startChat(username: string): void {
    console.log('Démarrer le chat avec', username);
    // Logique pour démarrer un chat avec le nom d'utilisateur
  }

  logout(): void {
    this.authService.logout(); // Appel à la méthode logout du service AuthService
  }
}
