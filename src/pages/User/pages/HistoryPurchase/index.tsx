import classNames from 'classnames'
import { Link, NavLink, createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { purchasesStatus } from 'src/constants/purchase'
import UseQueryParams from 'src/hooks/UseQueryParams'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import { AiOutlineFieldTime } from 'react-icons/ai'
import noCard from 'src/assets/image/no-cart.png'
import { useMutation, useQuery } from 'react-query'
import { purchaseService } from 'src/services/purchase.service'
import { pathRoutes } from 'src/constants/path.routes'
import Button from 'src/components/atoms/Button'
import { toast } from 'react-toastify'

export default function HistoryPurchase() {
  const location = useLocation()

  const orderCancelMutation = useMutation({ mutationFn: purchaseService.updatePurchase })

  const handleCancelOrder = ({ buy_count, purchase_id }: { buy_count: number; purchase_id: string }) => {
    orderCancelMutation.mutate(
      { status: purchasesStatus.cancelled, buy_count: buy_count, purchase_id: purchase_id },
      {
        onSuccess: () => {
          toast.success('Hủy đơn thành công')
          refetch()
        }
      }
    )
  }

  const purchaseTabs = [
    { status: purchasesStatus.all, name: 'Tất cả đơn mua' },
    { status: purchasesStatus.waitForConfirmation, name: 'Chờ xác nhận' },
    { status: purchasesStatus.waitForGetting, name: 'Chờ lấy hàng' },
    { status: purchasesStatus.inProgress, name: 'Đang giao' },
    { status: purchasesStatus.delivered, name: 'Đã giao' },
    { status: purchasesStatus.cancelled, name: 'Đã hủy' }
  ]

  const queryParams: { status?: string } = UseQueryParams()
  const status: number = Number(queryParams.status) || purchasesStatus.all

  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () => purchaseService.getPurchases({ status: status as PurchaseListStatus })
  })

  const navigate = useNavigate()

  const purchasesInCart = purchasesInCartData?.data.data

  const addToCartMutation = useMutation(purchaseService.addToCart)

  const buyNow = async (buyCount: number, product_id: string) => {
    const res = await addToCartMutation.mutateAsync({ buy_count: buyCount, product_id: product_id })
    const purchaseId = res.data.data._id

    navigate(pathRoutes.cart, {
      state: {
        purchaseId: purchaseId
      }
    })
  }

  const purchaseTabsLink = purchaseTabs.map((tab) => (
    <NavLink
      key={tab.status}
      to={{
        pathname: pathRoutes.historyPurchase,
        search: createSearchParams({
          status: String(tab.status)
        }).toString()
      }}
      className={classNames(
        ' flex flex-1 items-center justify-center border-b-2 bg-white pb-4 text-center capitalize',
        {
          'border-b-primary text-primary': status === tab.status,
          'border-b-black/10 text-gray-900': status !== tab.status
        }
      )}
    >
      {tab.name}
    </NavLink>
  ))

  const productPrice = (purchase: Purchase) => {
    return (
      <>
        <span className='mr-1 text-gray-300 line-through'>₫{formatCurrency(purchase.price_before_discount)}</span>
        <span className='text-primary'>₫{formatCurrency(purchase.price)}</span>
      </>
    )
  }
  return (
    <div>
      <div className='overflow-x-auto text-gray-700 scrollbar scrollbar-w-full scrollbar-h-1'>
        <div className='min-w-[700px]'>
          <div>
            <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{purchaseTabsLink}</div>
          </div>
        </div>
      </div>
      {purchasesInCart && purchasesInCart?.length > 0 ? (
        <div>
          {purchasesInCart?.map((purchase) => (
            <div key={purchase._id} className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'>
              <div className='flex flex-col'>
                <div className='items-center justify-between md:flex'>
                  <Link
                    to={`${pathRoutes.productList}${generateNameId({
                      name: purchase.product.name,
                      id: purchase.product._id
                    })}`}
                    className='flex items-center'
                  >
                    <img
                      className='mr-3 h-20 w-20 border-[1px] border-black/20 object-cover'
                      src={purchase.product.image}
                      alt=''
                    />
                    <div>
                      <div className='text-base line-clamp-2'>{purchase.product.name}</div>
                      <div className='mt-1 flex items-center justify-between'>
                        <div className='flex'>
                          <span className='mr-1 md:hidden'>x</span>
                          <div className='flex'>
                            <span className='mr-1 hidden md:block'>Số lượng sản phẩm:</span>
                            <span>{purchase.buy_count}</span>
                          </div>
                        </div>
                        <div className='block md:hidden'>{productPrice(purchase)}</div>
                      </div>
                    </div>
                  </Link>
                  <div className='hidden md:block'>
                    <div>{productPrice(purchase)}</div>
                  </div>
                </div>
                <div className='mt-6 flex items-end justify-between md:items-center'>
                  <div className='flex items-center'>
                    <span className='mr-2'>
                      <AiOutlineFieldTime className='text-2xl' />
                    </span>
                    <span className=''>{new Date(purchase.updatedAt).toLocaleString('vi-VN')}</span>
                  </div>
                  <div className='flex flex-col items-end'>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs capitalize md:text-sm'>Thành tiền:</span>
                      <span className='text-lg font-bold text-primary md:text-2xl'>
                        ₫{formatCurrency(purchase.buy_count * purchase.price)}
                      </span>
                    </div>
                    <div className='flex gap-4'>
                      <Button
                        widthIcon={false}
                        className='mt-4 flex uppercase font-semibold w-[180px] items-center justify-center rounded-sm bg-primary py-[10px] text-sm text-white'
                        onClick={() => buyNow(purchase.buy_count, purchase.product._id)}
                      >
                        Mua lại
                      </Button>
                      {location.search === '?status=1' && (
                        <Button
                          widthIcon={false}
                          className='mt-4 bg-transparent uppercase font-semibold border-[2px] border-primary flex w-[180px] items-center justify-center rounded-sm bg-primary py-[10px] text-sm text-white'
                          onClick={() =>
                            handleCancelOrder({ buy_count: purchase.buy_count, purchase_id: purchase._id })
                          }
                        >
                          <div className='text-primary'>Hủy đơn</div>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='mt-5 flex flex-col items-center rounded-sm bg-white py-40 shadow-sm'>
          {/* <img className='h-24 w-24' src={noCard} alt='' /> */}
          <div>Chưa có đơn hàng</div>
        </div>
      )}
    </div>
  )
}
