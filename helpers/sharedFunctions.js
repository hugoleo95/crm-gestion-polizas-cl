export const getFormattedPrice = (price, uf = false) => {
  const formatter = new Intl.NumberFormat("de-DE", {
    style: "decimal",
    currency: "EUR",
    maximumFractionDigits: uf ? 2 : 0,
  })
  return `${uf ? 'UF ' : '$'}${formatter.format(price)}`
}

export const getFormattedPrice2 = (price, uf = false) => {
  const formatter = new Intl.NumberFormat("de-DE", {
    style: "decimal",
    currency: "EUR",
  })
  return `${uf ? '' : ''}${formatter.format(price)}`
}
