using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AnimalCare.Migrations
{
    /// <inheritdoc />
    public partial class CreatedMedicationSchedule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "IdentityRole",
                keyColumn: "Id",
                keyValue: "63b6afc9-cf69-43f4-8822-6d3deb9bf9a2");

            migrationBuilder.DeleteData(
                table: "IdentityRole",
                keyColumn: "Id",
                keyValue: "7ba52e3d-8e28-4429-b3d4-c79451ea8ec1");

            migrationBuilder.DeleteData(
                table: "IdentityRole",
                keyColumn: "Id",
                keyValue: "83a679e1-c23b-49bf-906f-cbb26420ec63");

            migrationBuilder.DeleteData(
                table: "IdentityRole",
                keyColumn: "Id",
                keyValue: "c3c1f488-6c1c-46aa-b173-1891de6cfc80");

            migrationBuilder.CreateTable(
                name: "MedicationSchedule",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ExaminationRecordId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Drug = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DaysOfWeek = table.Column<int>(type: "int", nullable: false),
                    FrequencyInWeeks = table.Column<int>(type: "int", nullable: false),
                    DailyDoseCount = table.Column<int>(type: "int", nullable: false),
                    Start = table.Column<DateTime>(type: "datetime2", nullable: false),
                    End = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    ExaminationRecordIdId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationSchedule", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicationSchedule_ExaminationRecord_ExaminationRecordId",
                        column: x => x.ExaminationRecordId,
                        principalTable: "ExaminationRecord",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "IdentityRole",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "116274ed-12c6-4a2b-b007-f128af52582b", null, "Volunteer", "VOLUNTEER" },
                    { "5ede59fa-7510-4bfd-a78e-5c2bca74be8d", null, "Veterinarian", "VETERINARIAN" },
                    { "88d5a96d-2b93-4cb7-bf71-47800a6541f4", null, "Administrator", "ADMINISTRATOR" },
                    { "ab352284-9bcb-4727-8a0f-39552e437ef9", null, "Caretaker", "CARETAKER" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_MedicationSchedule_ExaminationRecordId",
                table: "MedicationSchedule",
                column: "ExaminationRecordId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MedicationSchedule");

            migrationBuilder.DeleteData(
                table: "IdentityRole",
                keyColumn: "Id",
                keyValue: "116274ed-12c6-4a2b-b007-f128af52582b");

            migrationBuilder.DeleteData(
                table: "IdentityRole",
                keyColumn: "Id",
                keyValue: "5ede59fa-7510-4bfd-a78e-5c2bca74be8d");

            migrationBuilder.DeleteData(
                table: "IdentityRole",
                keyColumn: "Id",
                keyValue: "88d5a96d-2b93-4cb7-bf71-47800a6541f4");

            migrationBuilder.DeleteData(
                table: "IdentityRole",
                keyColumn: "Id",
                keyValue: "ab352284-9bcb-4727-8a0f-39552e437ef9");

            migrationBuilder.InsertData(
                table: "IdentityRole",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "63b6afc9-cf69-43f4-8822-6d3deb9bf9a2", null, "Caretaker", "CARETAKER" },
                    { "7ba52e3d-8e28-4429-b3d4-c79451ea8ec1", null, "Volunteer", "VOLUNTEER" },
                    { "83a679e1-c23b-49bf-906f-cbb26420ec63", null, "Administrator", "ADMINISTRATOR" },
                    { "c3c1f488-6c1c-46aa-b173-1891de6cfc80", null, "Veterinarian", "VETERINARIAN" }
                });
        }
    }
}
