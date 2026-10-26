# Heroes

1. Install latest .NET SDK. Or use a .NET SDK Docker image.

2. Install HeroesDataParser (HDP).

   ```
   dotnet tool install --global HeroesDataParser
   ```

3. Run HDP to download full data.

   ```
   dotnet heroes-data-parser online -e hero:i -g 4 -o hdp
   ```

4. Transform HDP data to site data.

   ```
   npm run transform-data
   ```
