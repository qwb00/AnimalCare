using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AnimalCare.Migrations
{
    /// <inheritdoc />
    public partial class AddedRolesToDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Animals",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "Animals",
                columns: new[] { "Id", "Age", "Breed", "DateFound", "History", "Name", "Photo", "Species", "Type" },
                values: new object[,]
                {
                    { new Guid("37f81748-796e-4bbf-b80d-3b65583dc04b"), 3, "Persian", new DateTime(2024, 10, 16, 2, 3, 31, 689, DateTimeKind.Local).AddTicks(9466), "", "Lucy", "", "Cat", "Cat" },
                    { new Guid("48378c27-4efa-45c6-a6c8-5695fa70f1d1"), 5, "German Shepherd", new DateTime(2024, 10, 16, 2, 3, 31, 689, DateTimeKind.Local).AddTicks(9459), "", "Max", "", "Dog", "Dog" },
                    { new Guid("56a7d79a-2af3-43e1-8905-43b2dec85887"), 3, "Labrador Retriever", new DateTime(2024, 10, 16, 2, 3, 31, 689, DateTimeKind.Local).AddTicks(9444), "", "Bella", "", "Dog", "Dog" },
                    { new Guid("978b9cbb-acf5-4a4c-ba8c-c8e496473625"), 1, "Maine Coon", new DateTime(2024, 10, 16, 2, 3, 31, 689, DateTimeKind.Local).AddTicks(9617), "", "Milo", "", "Cat", "Cat" },
                    { new Guid("c11fae18-6bb7-4e32-a133-1a16299edd42"), 2, "Siamese", new DateTime(2024, 10, 16, 2, 3, 31, 689, DateTimeKind.Local).AddTicks(9461), "", "Luna", "", "Cat", "Cat" },
                    { new Guid("dc3554a8-bead-448a-a4cf-8a62674d1dd2"), 4, "Bulldog", new DateTime(2024, 10, 16, 2, 3, 31, 689, DateTimeKind.Local).AddTicks(9463), "", "Charlie", "", "Dog", "Dog" }
                });

            migrationBuilder.InsertData(
                table: "Reservations",
                columns: new[] { "Id", "AnimalId", "EndDate", "IsEnded", "StartDate", "VolunteerId", "isAproved" },
                values: new object[,]
                {
                    { new Guid("410d0472-9834-490a-9a35-6ad1fe459499"), new Guid("54fb58d9-f5b7-4212-a2e5-48becb3c7556"), new DateTime(2023, 10, 2, 15, 30, 0, 0, DateTimeKind.Unspecified), false, new DateTime(2023, 10, 2, 14, 0, 0, 0, DateTimeKind.Unspecified), new Guid("1ae53408-8c0e-4c2d-9670-7165c1fd5dd2"), false },
                    { new Guid("6010c19f-105b-4332-8d7b-322446924ec4"), new Guid("6b460ac8-e980-4156-ab54-6879ae3d5765"), new DateTime(2023, 10, 1, 11, 0, 0, 0, DateTimeKind.Unspecified), false, new DateTime(2023, 10, 1, 10, 0, 0, 0, DateTimeKind.Unspecified), new Guid("67c78ab0-a065-4643-a08d-8f90ca75ed85"), false },
                    { new Guid("8b948342-f0f9-49a4-884b-988b5578f3b4"), new Guid("d8258da5-7d52-41a7-9ed6-bff3fb8d3019"), new DateTime(2023, 10, 3, 11, 0, 0, 0, DateTimeKind.Unspecified), false, new DateTime(2023, 10, 3, 9, 0, 0, 0, DateTimeKind.Unspecified), new Guid("917fbf03-8eea-4fcd-b7fd-3ec45a7bfc8d"), false },
                    { new Guid("f7a6fdf6-21d8-41c3-bd52-2ecd7188d2ef"), new Guid("07ca3758-9282-4e41-b7fa-74cc487d81b7"), new DateTime(2023, 10, 4, 12, 0, 0, 0, DateTimeKind.Unspecified), false, new DateTime(2023, 10, 4, 11, 0, 0, 0, DateTimeKind.Unspecified), new Guid("7df948c5-8a6c-43e2-af95-d4409d87908f"), false }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Animals",
                keyColumn: "Id",
                keyValue: new Guid("37f81748-796e-4bbf-b80d-3b65583dc04b"));

            migrationBuilder.DeleteData(
                table: "Animals",
                keyColumn: "Id",
                keyValue: new Guid("48378c27-4efa-45c6-a6c8-5695fa70f1d1"));

            migrationBuilder.DeleteData(
                table: "Animals",
                keyColumn: "Id",
                keyValue: new Guid("56a7d79a-2af3-43e1-8905-43b2dec85887"));

            migrationBuilder.DeleteData(
                table: "Animals",
                keyColumn: "Id",
                keyValue: new Guid("978b9cbb-acf5-4a4c-ba8c-c8e496473625"));

            migrationBuilder.DeleteData(
                table: "Animals",
                keyColumn: "Id",
                keyValue: new Guid("c11fae18-6bb7-4e32-a133-1a16299edd42"));

            migrationBuilder.DeleteData(
                table: "Animals",
                keyColumn: "Id",
                keyValue: new Guid("dc3554a8-bead-448a-a4cf-8a62674d1dd2"));

            migrationBuilder.DeleteData(
                table: "Reservations",
                keyColumn: "Id",
                keyValue: new Guid("410d0472-9834-490a-9a35-6ad1fe459499"));

            migrationBuilder.DeleteData(
                table: "Reservations",
                keyColumn: "Id",
                keyValue: new Guid("6010c19f-105b-4332-8d7b-322446924ec4"));

            migrationBuilder.DeleteData(
                table: "Reservations",
                keyColumn: "Id",
                keyValue: new Guid("8b948342-f0f9-49a4-884b-988b5578f3b4"));

            migrationBuilder.DeleteData(
                table: "Reservations",
                keyColumn: "Id",
                keyValue: new Guid("f7a6fdf6-21d8-41c3-bd52-2ecd7188d2ef"));

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Animals");
        }
    }
}
