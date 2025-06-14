import { ref } from 'vue'
import $ from 'jquery'
import 'datatables.net-dt'
import api from '@/services/api'

export function useDataTable({
  tableId,
  endpoint,
  columns,
  onClickEdit,
  onClickDelete,
  onClickShow,
}) {
  const dataTable = ref(null)

  function init() {
    if (dataTable.value) {
      dataTable.value.destroy()
      $(`#${tableId}`).empty()
    }

    dataTable.value = $(`#${tableId}`).DataTable({
      ajax: function (_data, callback, _settings) {
        api
          .get(endpoint)
          .then((response) => callback({ data: response.data })) // Entrega os dados ao DataTables
          .catch(
            (error) => callback({ data: [] }) // evita que a tabela quebre
          )
      },
      columns,
      responsive: true,
      processing: true,
      rowId: 'id',
      // dataSrc: '',
      dataSrc: function (response) {
        return response.data
      }, // Ajuste para o formato esperado pelo DataTables
      language: { url: '/assets/DataTables.pt_BR.json' },
      lengthMenu: [
        [5, 10, 25, -1],
        [5, 10, 25, 'Todos'],
      ],
      drawCallback() {
        bindTableEvents()
      },
    })
  }

  function refreshTable() {
    if (!dataTable.value) {
      console.warn('DataTable ainda não está inicializado.')
      return
    }
    dataTable.value?.ajax?.reload(null, false)
  }

  function bindTableEvents() {
    const table = $(`#${tableId}`)

    table.off('click', '.btnEdit')
    table.off('click', '.btnDelete')
    table.off('click', '.btnShow')

    table.on('click', '.btnEdit', (e) => {
      const id = $(e.currentTarget).data('id')
      if (onClickEdit) onClickEdit(id)
    })

    table.on('click', '.btnDelete', (e) => {
      const id = $(e.currentTarget).data('id')
      const rowData = dataTable.value.row(`#${id}`).data()
      // console.log('Linha selecionada para exclusão:', rowData)
      if (onClickDelete) onClickDelete(rowData)
    })

    table.on('click', '.btnShow', (e) => {
      const id = $(e.currentTarget).data('id')
      if (onClickShow) onClickShow(id)
    })
  }

  return {
    init,
    refreshTable,
    dataTable,
  }
}
