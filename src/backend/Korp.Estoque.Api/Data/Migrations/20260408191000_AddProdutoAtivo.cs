using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Korp.Estoque.Api.Data.Migrations
{
	/// <inheritdoc />
	public partial class AddProdutoAtivo : Migration
	{
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.AddColumn<bool>(
					name: "Ativo",
					table: "Produtos",
					type: "boolean",
					nullable: false,
					defaultValue: true);
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropColumn(
					name: "Ativo",
					table: "Produtos");
		}
	}
}
