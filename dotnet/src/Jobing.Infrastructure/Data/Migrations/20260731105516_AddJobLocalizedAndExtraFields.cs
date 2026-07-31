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

            migrationBuilder.Sql(
                "ALTER TABLE public.jobs ALTER COLUMN title TYPE jsonb USING title::jsonb;");

            migrationBuilder.Sql(
                "ALTER TABLE public.jobs ALTER COLUMN salary_text TYPE jsonb USING salary_text::jsonb;");

            migrationBuilder.Sql(
                "ALTER TABLE public.jobs ALTER COLUMN requirements TYPE jsonb USING requirements::jsonb;");

            migrationBuilder.Sql(
                "ALTER TABLE public.jobs ALTER COLUMN description TYPE jsonb USING description::jsonb;");

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

            migrationBuilder.Sql(
                "ALTER TABLE public.jobs ALTER COLUMN title TYPE character varying(255) USING title::text;");

            migrationBuilder.Sql(
                "ALTER TABLE public.jobs ALTER COLUMN salary_text TYPE character varying(200) USING salary_text::text;");

            migrationBuilder.Sql(
                "ALTER TABLE public.jobs ALTER COLUMN requirements TYPE text USING requirements::text;");

            migrationBuilder.Sql(
                "ALTER TABLE public.jobs ALTER COLUMN description TYPE text USING description::text;");
        }
    }
}
