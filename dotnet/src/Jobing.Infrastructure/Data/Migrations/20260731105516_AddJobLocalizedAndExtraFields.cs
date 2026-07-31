using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jobing.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddJobLocalizedAndExtraFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Wrap existing plain-text values into a localized object before the columns
            // become jsonb, otherwise Postgres rejects non-JSON text on cast.
            migrationBuilder.Sql("""
                UPDATE jobs
                SET "title" = jsonb_build_object('az', "title", 'en', "title", 'ru', "title")::text;
                """);
            migrationBuilder.Sql("""
                UPDATE jobs
                SET "salary_text" = jsonb_build_object('az', "salary_text", 'en', "salary_text", 'ru', "salary_text")::text
                WHERE "salary_text" IS NOT NULL;
                """);
            migrationBuilder.Sql("""
                UPDATE jobs
                SET "requirements" = jsonb_build_object('az', "requirements", 'en', "requirements", 'ru', "requirements")::text
                WHERE "requirements" IS NOT NULL;
                """);
            migrationBuilder.Sql("""
                UPDATE jobs
                SET "description" = jsonb_build_object('az', "description", 'en', "description", 'ru', "description")::text
                WHERE "description" IS NOT NULL;
                """);

            migrationBuilder.AlterColumn<string>(
                name: "title",
                schema: "public",
                table: "jobs",
                type: "jsonb",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "salary_text",
                schema: "public",
                table: "jobs",
                type: "jsonb",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "requirements",
                schema: "public",
                table: "jobs",
                type: "jsonb",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "description",
                schema: "public",
                table: "jobs",
                type: "jsonb",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "application_method",
                schema: "public",
                table: "jobs",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "application_url",
                schema: "public",
                table: "jobs",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "currency",
                schema: "public",
                table: "jobs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "view_count",
                schema: "public",
                table: "jobs",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "application_method",
                schema: "public",
                table: "jobs");

            migrationBuilder.DropColumn(
                name: "application_url",
                schema: "public",
                table: "jobs");

            migrationBuilder.DropColumn(
                name: "currency",
                schema: "public",
                table: "jobs");

            migrationBuilder.DropColumn(
                name: "view_count",
                schema: "public",
                table: "jobs");

            migrationBuilder.AlterColumn<string>(
                name: "title",
                schema: "public",
                table: "jobs",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "jsonb");

            migrationBuilder.AlterColumn<string>(
                name: "salary_text",
                schema: "public",
                table: "jobs",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "jsonb",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "requirements",
                schema: "public",
                table: "jobs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "jsonb",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "description",
                schema: "public",
                table: "jobs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "jsonb",
                oldNullable: true);
        }
    }
}
