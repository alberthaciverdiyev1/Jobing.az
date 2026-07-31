using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jobing.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSeoSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "seo_settings",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PageKey = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Title = table.Column<string>(type: "jsonb", nullable: true),
                    Description = table.Column<string>(type: "jsonb", nullable: true),
                    Keywords = table.Column<string>(type: "jsonb", nullable: true),
                    OgImage = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_seo_settings", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_seo_settings_DeletedAt",
                schema: "public",
                table: "seo_settings",
                column: "DeletedAt");

            migrationBuilder.CreateIndex(
                name: "IX_seo_settings_IsActive",
                schema: "public",
                table: "seo_settings",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_seo_settings_PageKey",
                schema: "public",
                table: "seo_settings",
                column: "PageKey",
                unique: true);

            // Move existing seo.* settings rows into the home SEO page before removing them
            // from settings, so any customized values are preserved.
            migrationBuilder.Sql("""
                INSERT INTO seo_settings ("Id", "PageKey", "Title", "Description", "Keywords", "OgImage", "IsActive", "CreatedAt", "UpdatedAt", "DeletedAt")
                SELECT gen_random_uuid(),
                       'home',
                       (SELECT "Value" FROM settings WHERE "Key" = 'seo.default.title' LIMIT 1),
                       (SELECT "Value" FROM settings WHERE "Key" = 'seo.default.description' LIMIT 1),
                       (SELECT "Value" FROM settings WHERE "Key" = 'seo.keywords' LIMIT 1),
                       (SELECT "Value"->>'az' FROM settings WHERE "Key" = 'seo.og.image' LIMIT 1),
                       true,
                       now(),
                       NULL,
                       NULL
                WHERE EXISTS (SELECT 1 FROM settings WHERE "Key" = 'seo.default.title');

                DELETE FROM settings WHERE "Key" LIKE 'seo.%';
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "seo_settings",
                schema: "public");
        }
    }
}
