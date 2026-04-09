import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from '../Pages/produtos/produtos-model';
import { BaseApiService } from './base/base-api.service';

@Injectable({ providedIn: 'root' })
export class ProdutosApiService extends BaseApiService {
	portaApi = '5101';

	public controleReloadListagem = signal(false);
	modificandoProduto = signal<Produto | null>(null);

	listar(ativo?: boolean): Observable<Produto[]> {
		const query = ativo !== undefined ? `?ativo=${ativo}` : '';
		return this.get<Produto>(`produtos${query}`);
	}

	criar(payload: { codigo: string; descricao: string; saldo: number }): Observable<Produto> {
		return this.post<Produto>('produtos', payload);
	}

	editar(id: number, payload: { codigo: string; descricao: string; saldo: number }): Observable<Produto> {
		return this.put<Produto>(`produtos/${id}`, payload);
	}

	excluir(id: number): Observable<void> {
		return this.delete(`produtos/${id}`);
	}

}
