import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';  // Corrigé : importation depuis rxjs/operators

// Interface de l'utilisateur
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080';  // Remplacez avec l'URL de votre API backend
  private connectedUsers: Set<string> = new Set<string>(); // Liste des utilisateurs connectés

  constructor(private http: HttpClient) { }

  // Ajouter un utilisateur à la liste des connectés
  addConnectedUser(email: string): void {
    this.connectedUsers.add(email);
  }

  // Retirer un utilisateur de la liste des connectés
  removeConnectedUser(email: string): void {
    this.connectedUsers.delete(email);
  }

  // Récupérer tous les utilisateurs de l'API
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      catchError((error: any) => {  // Définition du type 'any' pour 'error'
        console.error('Erreur lors de la récupération des utilisateurs', error);
        return throwError(error);
      })
    );
  }

  // Méthode pour récupérer un utilisateur par son nom
  getUserByName(name: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${name}`).pipe(
      catchError((error: any) => {  // Définition du type 'any' pour 'error'
        console.error('Erreur lors de la récupération de l\'utilisateur', error);
        return throwError(error);
      })
    );
  }

// Récupérer l'utilisateur actuel
getCurrentUser(): Observable<User> {
  return this.http.get<User>(`${this.apiUrl}/users/current-user`).pipe(
    catchError((error: any) => {
      console.error('Erreur lors de la récupération de l\'utilisateur connecté', error);
      return throwError(error);
    })
  );
}
}
