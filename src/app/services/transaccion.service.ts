import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaccion } from '../models/transaccion';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {
  private apiUrl = `${environment.apiUrl}/transacciones`; 

  constructor(private http: HttpClient) { }

  getAll(): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(this.apiUrl);
  }

  getById(id: number): Observable<Transaccion> {
    return this.http.get<Transaccion>(`${this.apiUrl}/${id}`);
  }

  getByVale(valeId: number): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(`${this.apiUrl}/vale/${valeId}`);
  }

  create(transaccion: any): Observable<Transaccion> {
    return this.http.post<Transaccion>(this.apiUrl, transaccion);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}