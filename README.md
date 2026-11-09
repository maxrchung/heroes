# Heroes

Heroes is a simple reference site for Heroes of the Storm heroes, abilities, and
talents. The HOTS wikis are very sluggish for me and hard to navigate, so I
wanted to make something slimmed down with the bare minimum I care about.

This site has a landing page with all the heroes and a few sort options. The
hero detail page has a brief description, followed by abilities and talents.

Thanks to
[HeroesDataParser](https://github.com/HeroesToolChest/HeroesDataParser) for
getting the data for the site.

## Screenshots

<img width="1920" height="1872" alt="image" src="https://github.com/user-attachments/assets/fe9899ad-a334-4b7d-87a4-0ce273eeb300" />

<img width="1920" height="1872" alt="image" src="https://github.com/user-attachments/assets/253bb06e-26d2-40d3-a4e9-2b9c4fbafa4c" />

<img width="654" height="1005" alt="image" src="https://github.com/user-attachments/assets/761deae9-de65-4546-a0bb-dab164372c6e" />

<img width="654" height="1005" alt="image" src="https://github.com/user-attachments/assets/84ca9434-3a3a-487b-8a3b-ad468a9c9007" />

## Dev

1. Install .NET SDK.

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
