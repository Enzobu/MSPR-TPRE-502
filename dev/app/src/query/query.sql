SELECT
  s._date AS ds,
  s.confirmed AS y,
  c.population,
  c.pib,
  c.id_continent,
  c.id_region
FROM
  public.statement s
JOIN
  public.country c ON s.id_country = c.id_country
LEFT JOIN
  public.country_climat_type cc ON c.id_country = cc.id_country
WHERE
  s.id_disease = 1
ORDER BY
  c.name, s._date