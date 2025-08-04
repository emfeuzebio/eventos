/**
 * Converte para Data + Hora pt-BR com Dia da Semana na frente
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
  var dateTime = '';
  // console.log(fixedDateStr)
  // console.log(date)
  // Date Thu Nov 09 2023 14:00:00 GMT-0300 (Brasilia Standard Time)

  if (isNaN(date)) return dateStr

  const weekday = new Intl.DateTimeFormat('pt-BR', {
    // weekday: 'long',
    weekday: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(date)

  dateTime = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,  
    timeZone: 'America/Sao_Paulo',
  }).format(date)

  dateTime = dateTime.replace(',', ' ')
  dateTime = dateTime.replace('.', '')

  // Capitaliza o primeiro caractere do dia da semana
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1)

  return `${capitalizedWeekday} ${dateTime} h.`  
}

/**
 * Converte para Data pt-BR 
 */
export function formatToBrDate(dateStr) {
  if (!dateStr) return ''

  // Se for só "YYYY-MM-DD", parse manual
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    const [year, month, day] = parts
    const localDate = new Date(+year, +month - 1, +day) // mês começa em 0
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(localDate)
  }

  // Se vier com hora, usar normalmente
  const fixedDateStr = dateStr.replace(' ', 'T')
  const date = new Date(fixedDateStr)

  if (isNaN(date)) return dateStr

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(date)
}


/**
 * Converte para Data pt-BR com Dia da Semana na frente
 */
export function formatToBrDateWeek(dateStr) {
  if (!dateStr) return ''
  // console.log(dateStr)

  const fixedDateStr = dateStr.replace(' ', 'T')
  const date = new Date(fixedDateStr)
  var dateTime = '';
  // console.log(fixedDateStr)
  // console.log(date)
  // Date Thu Nov 09 2023 14:00:00 GMT-0300 (Brasilia Standard Time)

  if (isNaN(date)) return dateStr

  const weekday = new Intl.DateTimeFormat('pt-BR', {
    // weekday: 'long',
    weekday: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(date)

  dateTime = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour12: false,  
    timeZone: 'America/Sao_Paulo',
  }).format(date)

  dateTime = dateTime.replace(',', ' ')
  dateTime = dateTime.replace('.', '')

  // Capitaliza o primeiro caractere do dia da semana
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1)

  return `${capitalizedWeekday} ${dateTime}`  
}


/**
 * USAR quando as data armazenadas estiverem padrão ISO 8601 ou seja armazenadas com Fuso UTC-0
 * Ex Data-Hora padrão ISO 8601: 2025-07-05T02:54:24.000000Z ou Z indica Fuso UTC-0
 * @param esperado String  com T {'2023-11-10T22:50:00'} ou com espaço {'2023-11-10 22:50:00'}
 * @returns String no formato '10/11/2023'
 */
// export function formatToBrDate(dateStr) {
//   if (!dateStr) return ''

//   const fixedDateStr = dateStr.replace(' ', 'T')
//   const date = new Date(fixedDateStr)

//   console.log('formatToBrDate', date);

//   if (isNaN(date)) return dateStr

//   return new Intl.DateTimeFormat('pt-BR', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//     timeZone: 'America/Sao_Paulo',
//   }).format(date)
// }