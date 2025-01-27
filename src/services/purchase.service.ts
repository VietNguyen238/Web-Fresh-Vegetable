import { http } from 'src/utils/http'

const URL = 'purchases'

export const purchaseService = {
  addToCart(body: { product_id: string; buy_count: number }) {
    return http.post<SuccessResponse<Purchase>>(`${URL}/add-to-cart`, body)
  },
  getPurchases(params: { status: PurchaseListStatus }) {
    return http.get<SuccessResponse<Purchase[]>>(`${URL}`, {
      params
    })
  },
  buyProducts(body: { purchase_id: string }[]) {
    return http.post<SuccessResponse<Purchase[]>>(`${URL}/buy-products`, body)
  },

  updatePurchase(body: { product_id?: string; buy_count?: number; status?: number; purchase_id?: string }) {
    return http.put<SuccessResponse<Purchase>>(`${URL}/update-purchase`, body)
  },

  deletePurchase(purchaseIds: string[]) {
    return http.delete<SuccessResponse<{ delete_cound: number }>>(`${URL}`, {
      data: purchaseIds
    })
  },
  getPurchasesWithParam(status: PurchaseListStatus) {
    return http.get<SuccessResponse<Purchase[]>>(`${URL}/${status}`)
  }
}
