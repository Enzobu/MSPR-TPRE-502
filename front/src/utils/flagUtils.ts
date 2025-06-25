// Mapping des codes ISO3 vers ISO2 pour les émojis de drapeaux
const iso3ToIso2: { [key: string]: string } = {
  'AFG': 'AF', 'ALB': 'AL', 'DZA': 'DZ', 'AND': 'AD', 'AGO': 'AO', 'ARG': 'AR',
  'ARM': 'AM', 'ABW': 'AW', 'AUS': 'AU', 'AUT': 'AT', 'AZE': 'AZ', 'BHS': 'BS',
  'BHR': 'BH', 'BGD': 'BD', 'BRB': 'BB', 'BLR': 'BY', 'BEL': 'BE', 'BLZ': 'BZ',
  'BEN': 'BJ', 'BTN': 'BT', 'BOL': 'BO', 'BWA': 'BW', 'BRA': 'BR', 'BRN': 'BN',
  'BGR': 'BG', 'BFA': 'BF', 'BDI': 'BI', 'KHM': 'KH', 'CMR': 'CM', 'CAN': 'CA',
  'CPV': 'CV', 'CAF': 'CF', 'TCD': 'TD', 'CHL': 'CL', 'CHN': 'CN', 'COL': 'CO',
  'COM': 'KM', 'COG': 'CG', 'COD': 'CD', 'CRI': 'CR', 'CIV': 'CI', 'HRV': 'HR',
  'CUB': 'CU', 'CYP': 'CY', 'CZE': 'CZ', 'DNK': 'DK', 'DJI': 'DJ', 'DMA': 'DM',
  'DOM': 'DO', 'ECU': 'EC', 'EGY': 'EG', 'SLV': 'SV', 'GNQ': 'GQ', 'ERI': 'ER',
  'EST': 'EE', 'SWZ': 'SZ', 'ETH': 'ET', 'FJI': 'FJ', 'FIN': 'FI', 'FRA': 'FR',
  'GAB': 'GA', 'GMB': 'GM', 'GEO': 'GE', 'DEU': 'DE', 'GHA': 'GH', 'GRC': 'GR',
  'GRD': 'GD', 'GTM': 'GT', 'GIN': 'GN', 'GNB': 'GW', 'GUY': 'GY', 'HTI': 'HT',
  'HND': 'HN', 'HUN': 'HU', 'ISL': 'IS', 'IND': 'IN', 'IDN': 'ID', 'IRN': 'IR',
  'IRQ': 'IQ', 'IRL': 'IE', 'ISR': 'IL', 'ITA': 'IT', 'JAM': 'JM', 'JPN': 'JP',
  'JOR': 'JO', 'KAZ': 'KZ', 'KEN': 'KE', 'KIR': 'KI', 'PRK': 'KP', 'KOR': 'KR',
  'KWT': 'KW', 'KGZ': 'KG', 'LAO': 'LA', 'LVA': 'LV', 'LBN': 'LB', 'LSO': 'LS',
  'LBR': 'LR', 'LBY': 'LY', 'LIE': 'LI', 'LTU': 'LT', 'LUX': 'LU', 'MDG': 'MG',
  'MWI': 'MW', 'MYS': 'MY', 'MDV': 'MV', 'MLI': 'ML', 'MLT': 'MT', 'MHL': 'MH',
  'MRT': 'MR', 'MUS': 'MU', 'MEX': 'MX', 'FSM': 'FM', 'MDA': 'MD', 'MCO': 'MC',
  'MNG': 'MN', 'MNE': 'ME', 'MAR': 'MA', 'MOZ': 'MZ', 'MMR': 'MM', 'NAM': 'NA',
  'NRU': 'NR', 'NPL': 'NP', 'NLD': 'NL', 'NZL': 'NZ', 'NIC': 'NI', 'NER': 'NE',
  'NGA': 'NG', 'MKD': 'MK', 'NOR': 'NO', 'OMN': 'OM', 'PAK': 'PK', 'PLW': 'PW',
  'PAN': 'PA', 'PNG': 'PG', 'PRY': 'PY', 'PER': 'PE', 'PHL': 'PH', 'POL': 'PL',
  'PRT': 'PT', 'QAT': 'QA', 'ROU': 'RO', 'RUS': 'RU', 'RWA': 'RW', 'KNA': 'KN',
  'LCA': 'LC', 'VCT': 'VC', 'WSM': 'WS', 'SMR': 'SM', 'STP': 'ST', 'SAU': 'SA',
  'SEN': 'SN', 'SRB': 'RS', 'SYC': 'SC', 'SLE': 'SL', 'SGP': 'SG', 'SVK': 'SK',
  'SVN': 'SI', 'SLB': 'SB', 'SOM': 'SO', 'ZAF': 'ZA', 'SSD': 'SS', 'ESP': 'ES',
  'LKA': 'LK', 'SDN': 'SD', 'SUR': 'SR', 'SWE': 'SE', 'CHE': 'CH', 'SYR': 'SY',
  'TJK': 'TJ', 'TZA': 'TZ', 'THA': 'TH', 'TLS': 'TL', 'TGO': 'TG', 'TON': 'TO',
  'TTO': 'TT', 'TUN': 'TN', 'TUR': 'TR', 'TKM': 'TM', 'TUV': 'TV', 'UGA': 'UG',
  'UKR': 'UA', 'ARE': 'AE', 'GBR': 'GB', 'USA': 'US', 'URY': 'UY', 'UZB': 'UZ',
  'VUT': 'VU', 'VEN': 'VE', 'VNM': 'VN', 'YEM': 'YE', 'ZMB': 'ZM', 'ZWE': 'ZW'
};

/**
 * Convertit un code ISO3 (3 lettres) en code ISO2 (2 lettres)
 * @param iso3 - Code ISO3 du pays (ex: "FRA")
 * @returns Code ISO2 correspondant (ex: "FR") ou undefined si non trouvé
 */
export const convertIso3ToIso2 = (iso3: string): string | undefined => {
  return iso3ToIso2[iso3.toUpperCase()];
};

/**
 * Génère un émoji de drapeau à partir d'un code ISO3
 * @param iso3 - Code ISO3 du pays (ex: "FRA")
 * @returns Émoji du drapeau correspondant (ex: "🇫🇷") ou drapeau blanc si non trouvé
 */
export const getFlagEmojiFromIso3 = (iso3?: string): string => {
  if (!iso3) return '🏳️';
  
  const iso2 = convertIso3ToIso2(iso3);
  if (!iso2) return '🏳️';

  // Convertir le code ISO2 en émoji de drapeau
  return iso2
    .split('')
    .map(char => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('');
};

/**
 * Génère un émoji de drapeau à partir d'un code ISO2
 * @param iso2 - Code ISO2 du pays (ex: "FR")
 * @returns Émoji du drapeau correspondant (ex: "🇫🇷")
 */
export const getFlagEmojiFromIso2 = (iso2: string): string => {
  return iso2
    .toUpperCase()
    .split('')
    .map(char => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('');
}; 