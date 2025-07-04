/**
 * 
 * @param esperado String  com T {'2023-11-10T22:50:00'} dateStr 
 * @param caso venha sem T ele é colocado {'2023-11-10 22:50:00'} dateStr 
 * @returns String Quinta-feira 19/06/2025 14:00 h. 
 */
export function formatToBrDateTime(dateStr) {
  if (!dateStr) return ''
  // console.log(dateStr)

  const fixedDateStr = dateStr.replace(' ', 'T')
  const date = new Date(fixedDateStr)
  // console.log(fixedDateStr)
  // console.log(date)
  // Date Thu Nov 09 2023 14:00:00 GMT-0300 (Brasilia Standard Time)

  if (isNaN(date)) return dateStr

  const weekday = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    // weekday: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(date)

  const dateTime = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,  
    timeZone: 'America/Sao_Paulo',
  }).format(date)

  // Capitaliza o primeiro caractere do dia da semana
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1)

  return `${capitalizedWeekday} ${dateTime} h.`  
}
