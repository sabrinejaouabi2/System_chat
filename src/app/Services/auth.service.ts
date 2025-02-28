import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user';
import { Auth, LoginResponse } from '../models/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private currentUserSubject: BehaviorSubject<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromLocalStorage());
  }

  // Récupérer l'utilisateur connecté
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Vérifier si un utilisateur est connecté
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // Stocker l'utilisateur dans le localStorage
  private setUser(user: User): void {
    if (!user) {
      console.warn('Utilisateur invalide');
      return;
    }
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // Récupérer l'utilisateur depuis le localStorage
  private getUserFromLocalStorage(): User | null {
    const user = localStorage.getItem('currentUser');
    if (!user) return null;
    try {
      return JSON.parse(user) as User;
    } catch (e) {
      console.error('Erreur parsing currentUser:', e);
      return null;
    }
  }

  // Enregistrer un nouvel utilisateur
  register(user: Auth): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      catchError(error => {
        console.error('Erreur d\'inscription:', error);
        return throwError(error);
      })
    );
  }

  // Connexion de l'utilisateur
  login(userCredentials: Auth): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, userCredentials).pipe(
      tap(response => {
        if (!response?.user) {
          console.error('Erreur: Aucun utilisateur retourné');
          return;
        }
        this.setUser(response.user);
        this.setToken(response.token);
      }),
      catchError(error => {
        console.error('Erreur de connexion:', error);
        return throwError(error);
      })
    );
  }

  // Stocker le token JWT dans le localStorage
  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Récupérer le token JWT
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Déconnexion de l'utilisateur
  logout(): void {
    if (this.isAuthenticated()) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
    }
  }
}
