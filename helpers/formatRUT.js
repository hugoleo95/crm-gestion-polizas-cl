export default function formatRUT (rut) {
  if (!rut) {
    return null
  }
  const formattedRut = rut?.trim()?.replaceAll('.', '')
  const i = formattedRut?.indexOf('-') ?? formattedRut?.length - 1

  if (formattedRut?.length > 0 && i) {
    let rutNumbers = formattedRut.slice(0, i)
    const rutVerificator = formattedRut.slice(i, formattedRut.length)

    if (rutNumbers.length > 6) {
      rutNumbers = rutNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }
    return `${rutNumbers}${rutVerificator}`
  }
  return rut
}
