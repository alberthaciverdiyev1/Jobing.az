using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jobing.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SettingsLocalizedValue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_settings_Group",
                schema: "public",
                table: "settings");

            migrationBuilder.DropColumn(
                name: "Group",
                schema: "public",
                table: "settings");

            migrationBuilder.DropColumn(
                name: "SortOrder",
                schema: "public",
                table: "settings");

            // Wrap existing plain-text values into a localized object before the column
            // becomes jsonb, otherwise Postgres rejects non-JSON text on cast.
            migrationBuilder.Sql("""
                UPDATE settings
                SET "Value" = jsonb_build_object('az', "Value", 'en', "Value", 'ru', "Value")::text
                WHERE "Value" IS NOT NULL;
                """);

            migrationBuilder.Sql(
                "ALTER TABLE public.settings ALTER COLUMN \"Value\" TYPE jsonb USING \"Value\"::jsonb;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "ALTER TABLE public.settings ALTER COLUMN \"Value\" TYPE text USING \"Value\"::text;");

            migrationBuilder.AddColumn<string>(
                name: "Group",
                schema: "public",
                table: "settings",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SortOrder",
                schema: "public",
                table: "settings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_settings_Group",
                schema: "public",
                table: "settings",
                column: "Group");
        }
    }
}
