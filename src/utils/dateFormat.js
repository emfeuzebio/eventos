export function formatToBrDateTime(dateStr) {
  if (!dateStr) return ''

  const fixedDateStr = dateStr.replace(' ', 'T')
  const date = new Date(fixedDateStr)

  console.log(fixedDateStr)

  if (isNaN(date)) return dateStr

  const formatted = new Intl.DateTimeFormat('pt-BR', {
    // weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,  
    timeZone: 'America/Sao_Paulo',
  }).format(date)

  // return formatted.charAt(0).toUpperCase() + formatted.slice(1) + ' h.'
  // return formatted.slice(1) + ' h.'
  return formatted.slice(0) + ' h.'
  // return formatted

  // capitaliza e adiciona "h." no final
  // return formatted.charAt(0).toUpperCase() + formatted.slice(1) + ' h.'
}
