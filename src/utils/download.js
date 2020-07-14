import { pureAxios, axios } from '@/utils/request'
import api from '@/api'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// const downloadUrl = '/system/common/download'
// const mimeMap = {
//   xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//   zip: 'application/zip',
//   xml: 'application/xml'
// }
export function exportExcel (url, params) {
  const aLink = document.createElement('a')
  aLink.href = process.env.VUE_APP_API_BASE_URL + url+ '?token=' + Vue.ls.get(ACCESS_TOKEN) + params
  document.body.appendChild(aLink)
  aLink.click()
  document.body.removeChild(aLink)
  window.URL.revokeObjectURL(aLink.href)
}

// /**
//  * 下载.xlsx文件
//  * @param {String} filename 文件名
//  */
// export function downloadXlsx (filename) {
//   pureAxios({
//     url: downloadUrl,
//     method: 'get',
//     params: { fileName: filename, delete: true },
//     responseType: 'blob'
//   }).then(res => {
//     resolveBlob(res, mimeMap.xlsx)
//   })
// }
//
// /**
//  * 代码生成并下载为zip
//  * @param {String} url 链接
//  * @param {String} tables 表名
//  */
// export function genCodeZip (url, tables) {
//   pureAxios({
//     url: url,
//     method: 'get',
//     params: { tables: tables },
//     responseType: 'blob'
//   }).then(res => {
//     resolveBlob(res, mimeMap.zip)
//   })
// }

// export function resolveBlob (res, mimeType) {
//   const aLink = document.createElement('a')
//   var blob = new Blob([res.data], { type: mimeType })
//   // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
//   var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
//   var contentDisposition = decodeURI(res.headers['content-disposition'])
//   var result = patt.exec(contentDisposition)
//   var fileName = result[1]
//   aLink.href = URL.createObjectURL(blob)
//   aLink.setAttribute('download', fileName) // 设置下载文件名称
//   document.body.appendChild(aLink)
//   aLink.click()
//   document.body.removeChild(aLink)
//   window.URL.revokeObjectURL(aLink.href)
// }
