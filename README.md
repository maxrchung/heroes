# Heroes

Heroes is a simple reference site for Heroes of the Storm heroes, abilities, and
talents. The HOTS wikis are very sluggish for me and hard to navigate, so I
wanted to make something slimmed down with the bare minimum I care about.

This site has a landing page with all the heroes and a few sort options. The
hero detail page has a brief description, followed by abilities and talents.

Thanks to
[HeroesDataParser](https://github.com/HeroesToolChest/HeroesDataParser) for
parsing the data for the site.

## TODO

- Headings are links
- Toc in mobile navbar
- Maybe more sorts?

## Dev

1. Install latest .NET SDK. Or use a .NET SDK Docker image.

2. Install HeroesDataParser (HDP).

   ```sh
   dotnet tool install --global HeroesDataParser
   ```

3. Run HDP to download full data.

   ```sh
   dotnet heroes-data-parser online -e hero:i -g 2 -o hdp
   ```

4. Transform HDP data to site data.

   ```sh
   npm run transform-data
   ```

5. Run dev site.

   ```sh
   npm run dev
   ```
