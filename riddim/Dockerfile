#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
RUN apt-get update && apt-get install -y nodejs npm && rm -rf /var/lib/apt/lists/*
WORKDIR /src
COPY ["riddim/Riddim.csproj", "riddim/"]
RUN dotnet restore "riddim/Riddim.csproj"
COPY . .
WORKDIR "/src/riddim"
RUN dotnet build "Riddim.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Riddim.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Riddim.dll"]