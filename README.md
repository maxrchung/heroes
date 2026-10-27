# Heroes

1. Install latest .NET SDK. Or use a .NET SDK Docker image.

2. Install HeroesDataParser (HDP).

   ```sh
   dotnet tool install --global HeroesDataParser
   ```

3. Run HDP to download full data.

   ```sh
   dotnet heroes-data-parser online -e hero:i -g 4 -o hdp
   ```

4. Transform HDP data to site data.

   ```sh
   npm run transform-data
   ```
