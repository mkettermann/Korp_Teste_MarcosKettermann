using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Korp.Estoque.Api.Data.Migrations
{
	/// <inheritdoc />
	public partial class EnsureProdutoAtivoColumn : Migration
	{
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.Sql(@"
                ALTER TABLE ""Produtos""
                ADD COLUMN IF NOT EXISTS ""Ativo"" boolean NOT NULL DEFAULT TRUE;
            ");
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.Sql(@"
                ALTER TABLE ""Produtos""
                DROP COLUMN IF EXISTS ""Ativo"";
            ");
		}
	}
}
