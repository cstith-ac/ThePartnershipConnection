using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using WebAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Http;
using WebAPI.Infrastructure.ApplicationUserClaims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using WebAPI.Repository;

namespace WebAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //Inject AppSettings
            services.Configure<ApplicationSettings>(Configuration.GetSection("ApplicationSettings"));

            //services.AddDbContext<ApplicationDbContext>(options =>
            //{
            //    options.UseSqlServer(Configuration.GetConnectionString("TPC_DevDatabase"));
            //}, ServiceLifetime.Transient);
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("TPC_DevDatabase"),
                    sqlServerOptionsAction: sqlOptions =>
                    {
                        sqlOptions.EnableRetryOnFailure();
                    });

                //options.UseSqlServer(Configuration.GetConnectionString("AFADatabase"),
                //    sqlServerOptionsAction: sqlOptions =>
                //    {
                //        sqlOptions.EnableRetryOnFailure();
                //    });
            });
            services.AddIdentity<ApplicationUser, ApplicationRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            //New Cors policy
            services.AddCors(
                options => options.AddPolicy("AllowCors",
                    builder =>
                    {
                        builder
                            //.AllowAnyOrigin() // This is not secure and will need to be refactored
                                              //.WithOrigins("https://localhost:44390/")
                                              //.AllowCredentials()
                            .WithOrigins(Configuration["ApplicationSettings:Client_URL"].ToString())
                            //.WithOrigins("https://www.thepartnershipconnection.com", "https://dev-alarm-connections.pantheonsite.io/current-partners", "http://localhost:4200")
                            .AllowAnyHeader()
                            //.SetIsOriginAllowed(origin => true)
                            .AllowAnyMethod();
                    })
            );

            services.Configure<IdentityOptions>(options =>
            {
                // Default Password settings.
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 6;

                // Default SignIn settings.
                options.SignIn.RequireConfirmedEmail = false;
                options.SignIn.RequireConfirmedPhoneNumber = false; 
            });

            //services.AddControllers().AddNewtonsoftJson();
            services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.IgnoreNullValues = true;
            });

            services.AddApplicationInsightsTelemetry();

            //OLD Cors Policy
            //services.AddCors();

            services.AddTransient<TPC_DevContext>();
            services.AddTransient<AFAContext>();
            services.AddTransient<SedonaDocumentsContext>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddScoped<ICallSummaryAddRepository, CallSummaryAddRepository>();
            services.AddScoped<ICallSummaryUpdateRepository, CallSummaryUpdateRepository>();
            services.AddScoped<IIncentive_ADD_StartRepository, Incentive_ADD_StartRepository>();
            services.AddScoped<IIncentive_ADD_StartERepository, Incentive_ADD_StartERepository>();
            services.AddScoped<IIncentive_Add_RecurringRepository, Incentive_Add_RecurringRepository>();
            services.AddScoped<IIncentive_Add_EquipmentRepository, Incentive_Add_EquipmentRepository>();
            services.AddScoped<IIncentive_Add_LaborRepository, Incentive_Add_LaborRepository>();
            services.AddScoped<ICustomer_Document_ADDRepository, Customer_Document_ADDRepository>();
            services.AddScoped<IIncentive_Add_FinishRepository, Incentive_Add_FinishRepository>();
            services.AddScoped<IPartnerAddNoteRepository, PartnerAddNoteRepository>();
            services.AddScoped<IPermissionAddRepository, PermissionAddRepository>();
            services.AddScoped<IPermissionDeleteRepository, PermissionDeleteRepository>();
            services.AddScoped<IPartnerInvoiceListingXRepository, PartnerInvoiceListingXRepository>();
            //services.AddScoped<IPartnerLandingPageXRepository, PartnerLandingPageXRepository>();
            //services.AddScoped<IPartnerInvoiceListingRepository, PartnerInvoiceListingRepository>();
            //services.AddScoped<ICheckboxAutoInsertListRepository, CheckboxAutoInsertListRepository>();
            services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, ApplicationUserClaimsPrincipalFactory>();

            //JWT Authentication
            var key = Encoding.UTF8.GetBytes(Configuration["ApplicationSettings:JWT_Secret"].ToString());

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddCookie().AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = false;
                x.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                };
            });
            //services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            //    .AddCookie();

            services.AddAuthorization(options =>
            {
                options.DefaultPolicy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, ILogger<Startup> logger)
        {
            logger.LogInformation("Current Environment is {environmentName}", env.EnvironmentName);
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors("AllowCors");

            //app.UseCors(builder =>
            //    builder.WithOrigins(Configuration["ApplicationSettings:Client_URL"].ToString())
            //    .AllowAnyHeader()
            //    .AllowAnyMethod()
            //);

            //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
