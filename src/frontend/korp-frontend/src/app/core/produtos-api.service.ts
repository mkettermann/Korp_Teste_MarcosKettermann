import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from './models';

@Injectable({ providedIn: 'root' })
export class ProdutosApiService {
	private readonly http = inject(HttpClient);
	private readonly baseUrl = 'http://localhost:5101/api/produtos';

	listar(): Observable<Produto[]> {
		return this.http.get<Produto[]>(this.baseUrl);
	}

	criar(payload: { codigo: string; descricao: string; saldo: number }): Observable<Produto> {
		return this.http.post<Produto>(this.baseUrl, payload);
	}
}
