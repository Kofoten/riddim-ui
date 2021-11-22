using EntityFramework.Exceptions.PostgreSQL;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Riddim.Data.Auth;
using Riddim.Identity.Configuration;
using Riddim.Services;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http.Headers;

namespace Riddim
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            var authClients = new Dictionary<string, AuthenticationClient>();
            Configuration.GetSection("Jwt").Bind(authClients);

            services.AddDbContext<RiddimDbContext>(optionsBuilder =>
            {
                var connectionString = Configuration.GetValue<string>("RIDDIM_DB_CONNECTION_STRING");

                optionsBuilder.UseExceptionProcessor();
                optionsBuilder.UseNpgsql(connectionString);
            });

            //services.AddControllersWithViews();

            services.AddAuthorization(options =>
            {
                var requirement = new ClaimsAuthorizationRequirement("sub", null);
                options.DefaultPolicy = new AuthorizationPolicy(new IAuthorizationRequirement[] { requirement }, new string[] { JwtBearerDefaults.AuthenticationScheme });
                options.FallbackPolicy = null;
            });

            var authBuilder = services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            });

            foreach (var authClient in authClients)
            {
                authBuilder.AddJwtBearer(authClient.Key, options =>
                {
                    options.Audience = authClient.Value.Audience;
                    options.Authority = authClient.Value.Authority;

                    var saved = options.SecurityTokenValidators.Single();
                    options.SecurityTokenValidators.Clear();
                    options.SecurityTokenValidators.Add(new SecurityTokenValidator(saved));
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateAudience = true,
                        ValidateIssuer = true,
                        ValidateActor = false,
                        ValidIssuers = authClient.Value.Issuers,
                        ValidateIssuerSigningKey = false,
                        ValidateLifetime = true,
                        ValidateTokenReplay = false,
                        // SignatureValidator = OnTokenSignatureValidation
                    };
                });
            }

            authBuilder.AddPolicyScheme(JwtBearerDefaults.AuthenticationScheme, "Selector", options =>
            {
                options.ForwardDefaultSelector = context =>
                {
                    if (!TryParseAuthorization(context.Request, out var authenticationHeader))
                    {
                        return null; //failed, no authorization header
                    }
                    else if (authenticationHeader.Scheme != "Bearer")
                    {
                        return null;
                    }

                    var token = authenticationHeader.Parameter;
                    var securityToken = new JwtSecurityToken(token);

                    foreach (var authClient in authClients)
                    {
                        if (securityToken.Audiences.Contains(authClient.Value.Audience))
                        {
                            return authClient.Key;
                        }
                    }

                    return null;
                };
                options.ForwardDefault = authClients.First().Key;
            });


            services.AddControllers();
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthorization();
            app.UseAuthentication();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }

        private static bool TryParseAuthorization(HttpRequest request, out AuthenticationHeaderValue authenticationHeader)
        {
            if (!request.Headers.TryGetValue(HeaderNames.Authorization, out var stringValues))
            {
                authenticationHeader = null;
                return false;
            }

            var authorizationHeaderValue = stringValues.FirstOrDefault() ?? string.Empty;
            var firstSpaceAt = authorizationHeaderValue.IndexOf(" ");
            if (firstSpaceAt < 0)
            {
                authenticationHeader = null;
                return false;
            }

            authenticationHeader = new AuthenticationHeaderValue(authorizationHeaderValue.Substring(0, firstSpaceAt), authorizationHeaderValue.Substring(1 + firstSpaceAt));
            return true;
        }
    }
}
