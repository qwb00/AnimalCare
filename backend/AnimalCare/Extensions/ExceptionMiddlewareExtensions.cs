using Microsoft.AspNetCore.Diagnostics;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Models.ErrorModel;

namespace AnimalCare.Extensions
{
    public static class ExceptionMiddlewareExtensions
    {
        public static void ConfigureExceptionHandler(this WebApplication app)
        {
            app.UseExceptionHandler(appError =>
            {
                appError.Run(async context =>
                {
                    context.Response.ContentType = "application/json";

                    var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                    if (contextFeature != null)
                    {
                        var exception = contextFeature.Error;

                        (int statusCode, string message) = exception switch
                        {
                            DbUpdateException dbEx when dbEx.InnerException is SqlException sqlEx && sqlEx.Number == 2601
                                => (StatusCodes.Status400BadRequest, "This phone number is already taken."),
                            _ => (StatusCodes.Status500InternalServerError, exception.Message)
                        };

                        context.Response.StatusCode = statusCode;

                        await context.Response.WriteAsync(new ErrorDetails()
                        {
                            StatusCode = statusCode,
                            Message = message
                        }.ToString());
                    }
                });
            });
        }
    }
}
