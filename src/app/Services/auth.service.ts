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

  constructor(private http: HttpClient) { }
  // Exemple de récupération de l'email depuis localStorage
  getUserEmail(): string | null {
    return localStorage.getItem('userEmail'); // Vérifiez que vous avez bien stocké l'email dans le localStorage
  }

  // Méthode pour récupérer le token (si vous en avez un)
  getToken(): string | null {
    return localStorage.getItem('authToken'); // Assurez-vous que vous avez bien stocké le token
  }

// AuthService - Lors de la connexion
login(email: string, password: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
    tap((response) => {
      // Enregistrer l'email et le token dans localStorage
      localStorage.setItem('userEmail', email);
      localStorage.setItem('authToken', response.token);
    }),
    catchError(error => {
      return throwError(() => new Error('Erreur lors de la connexion'));
    })
  );
}



  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password });
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }



  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
