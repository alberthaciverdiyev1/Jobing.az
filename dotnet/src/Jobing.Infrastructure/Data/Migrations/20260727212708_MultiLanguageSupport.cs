using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jobing.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class MultiLanguageSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // text/varchar -> jsonb casts require an explicit USING clause in PostgreSQL.
            migrationBuilder.Sql(
                "ALTER TABLE public.news_categories ALTER COLUMN \"Name\" TYPE jsonb USING \"Name\"::jsonb;");

            migrationBuilder.Sql(
                "ALTER TABLE public.news ALTER COLUMN \"Title\" TYPE jsonb USING \"Title\"::jsonb;");

            migrationBuilder.Sql(
                "ALTER TABLE public.news ALTER COLUMN \"Excerpt\" TYPE jsonb USING \"Excerpt\"::jsonb;");

            migrationBuilder.Sql(
                "ALTER TABLE public.news ALTER COLUMN \"Content\" TYPE jsonb USING \"Content\"::jsonb;");

            migrationBuilder.Sql(
                "ALTER TABLE public.blog_posts ALTER COLUMN title TYPE jsonb USING title::jsonb;");

            migrationBuilder.Sql(
                "ALTER TABLE public.blog_posts ALTER COLUMN excerpt TYPE jsonb USING excerpt::jsonb;");

            migrationBuilder.Sql(
                "ALTER TABLE public.blog_posts ALTER COLUMN content TYPE jsonb USING content::jsonb;");

            migrationBuilder.Sql(
                "ALTER TABLE public.blog_categories ALTER COLUMN name TYPE jsonb USING name::jsonb;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // jsonb -> text/varchar casts require an explicit USING clause in PostgreSQL.
            migrationBuilder.Sql(
                "ALTER TABLE public.news_categories ALTER COLUMN \"Name\" TYPE character varying(200) USING \"Name\"::text;");

            migrationBuilder.Sql(
                "ALTER TABLE public.news ALTER COLUMN \"Title\" TYPE character varying(500) USING \"Title\"::text;");

            migrationBuilder.Sql(
                "ALTER TABLE public.news ALTER COLUMN \"Excerpt\" TYPE character varying(1000) USING \"Excerpt\"::text;");

            migrationBuilder.Sql(
                "ALTER TABLE public.news ALTER COLUMN \"Content\" TYPE text USING \"Content\"::text;");

            migrationBuilder.Sql(
                "ALTER TABLE public.blog_posts ALTER COLUMN title TYPE character varying(500) USING title::text;");

            migrationBuilder.Sql(
                "ALTER TABLE public.blog_posts ALTER COLUMN excerpt TYPE character varying(1000) USING excerpt::text;");

            migrationBuilder.Sql(
                "ALTER TABLE public.blog_posts ALTER COLUMN content TYPE text USING content::text;");

            migrationBuilder.Sql(
                "ALTER TABLE public.blog_categories ALTER COLUMN name TYPE character varying(200) USING name::text;");
        }
    }
}
