import { Routes } from '@angular/router';
import { NotasPageComponent } from './Pages/notas/notas-page.component';
import { ProdutosPageComponent } from './Pages/produtos/produtos-page.component';
import { ProdutosEditar } from './Pages/produtos/produtos-editar/produtos-editar';
import { ProdutosNovo } from './Pages/produtos/produtos-novo/produtos-novo';
import { ProdutosExcluir } from './Pages/produtos/produtos-excluir/produtos-excluir';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'produtos' },
	{
		path: 'produtos',
		component: ProdutosPageComponent,
		children: [
			{ path: 'novo', component: ProdutosNovo },
			{ path: 'editar/:id', component: ProdutosEditar },
			{ path: 'excluir/:id', component: ProdutosExcluir },
		],
	},
	{ path: 'notas', component: NotasPageComponent }
];
