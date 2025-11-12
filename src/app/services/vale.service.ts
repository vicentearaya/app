import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vale } from '../models/vale';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ValeService {
  private apiUrl = `${environment.apiUrl}/vales`; // ← CAMBIO AQUÍ

  constructor(private http: HttpClient) { }

  getAll(): Observable<Vale[]> {
    return this.http.get<Vale[]>(this.apiUrl);
  }

  getById(id: number): Observable<Vale> {
    return this.http.get<Vale>(`${this.apiUrl}/${id}`);
  }

  getByCodigo(codigo: string): Observable<Vale> {
    return this.http.post<Vale>(`${this.apiUrl}/buscar`, { codigo: codigo });
  }

  getByUser(userId: number): Observable<Vale[]> {
    return this.http.get<Vale[]>(`${this.apiUrl}/user/${userId}`);
  }

  create(vale: Vale): Observable<Vale> {
    return this.http.post<Vale>(this.apiUrl, vale);
  }

  update(id: number, vale: Vale): Observable<Vale> {
    return this.http.put<Vale>(`${this.apiUrl}/${id}`, vale);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}