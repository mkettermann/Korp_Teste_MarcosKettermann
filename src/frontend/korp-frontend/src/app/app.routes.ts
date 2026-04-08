import { Routes } from '@angular/router';
import { NotasPageComponent } from './Pages/notas/notas-page.component';
import { ProdutosPageComponent } from './Pages/produtos/produtos-page.component';
import { ProdutosEditar } from './Pages/produtos/produtos-editar/produtos-editar';
import { ProdutosNovo } from './Pages/produtos/produtos-novo/produtos-novo';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'produtos' },
	{
		path: 'produtos',
		component: ProdutosPageComponent,
		children: [
			{ path: 'novo', component: ProdutosNovo },
			{ path: 'editar', component: ProdutosEditar },
		],
	},
	{ path: 'notas', component: NotasPageComponent }
];
