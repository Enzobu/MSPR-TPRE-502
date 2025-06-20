export interface Continent {
  id: number;
  name: string;
  countries: number[]; // Array of country IDs
}

export const continents: Continent[] = [
  {
    id: 1,
    name: "Afrique",
    countries: [3, 7, 10, 14, 16, 17, 19, 21, 27, 28, 37, 39, 40, 42, 47, 48, 50, 56, 61, 64, 68, 80, 82, 88, 108, 109, 112, 115, 116, 117, 127, 132, 133, 134, 137, 140, 143, 155, 156, 160, 169, 173, 177, 178]
  },
  {
    id: 2,
    name: "Amérique du Nord",
    countries: [20, 35, 53, 59, 66, 79, 95, 100, 128, 149, 151, 157, 165, 170]
  },
  {
    id: 3,
    name: "Amérique du Sud",
    countries: [31, 44, 65, 92, 111, 120, 123, 147, 148, 152, 163, 168]
  },
  {
    id: 4,
    name: "Asie",
    countries: [5, 11, 13, 23, 24, 26, 29, 30, 32, 33, 34, 41, 52, 54, 55, 62, 72, 73, 75, 76, 77, 81, 85, 86, 97, 106, 110, 121, 122, 124, 126, 135, 136, 141, 144, 146, 153, 158, 159, 161, 166, 167, 172, 179]
  },
  {
    id: 5,
    name: "Europe",
    countries: [2, 4, 9, 15, 18, 22, 36, 38, 45, 46, 49, 63, 67, 70, 71, 74, 78, 83, 84, 87, 90, 91, 104, 107, 113, 118, 119, 125, 130, 131, 138, 139, 142, 154, 162, 164, 171, 180, 181]
  },
  {
    id: 6,
    name: "Océanie",
    countries: [1, 6, 25, 51, 58, 89, 93, 94, 96, 99, 102, 105, 114, 129, 145, 174, 175, 183, 184]
  }
];

// Fonction utilitaire pour obtenir les pays d'un continent
export const getCountriesByContinent = (continentId: number): number[] => {
  const continent = continents.find(c => c.id === continentId);
  return continent ? continent.countries : [];
};

// Fonction utilitaire pour obtenir le continent d'un pays
export const getContinentByCountry = (countryId: number): number | null => {
  const continent = continents.find(c => c.countries.includes(countryId));
  return continent ? continent.id : null;
}; 