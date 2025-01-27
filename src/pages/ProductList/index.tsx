import ProductItem from 'src/components/organisms/ProductItem'
import { BsFilterRight } from 'react-icons/bs'
import { MdKeyboardArrowUp } from 'react-icons/md'
import { useQuery } from 'react-query'
import { categoryService } from 'src/services/category.service'
import RatingStars from './components/RatingStars'
import Input from 'src/components/atoms/Input'
import { InputNumber } from 'src/components/atoms/InputNumber'
import { productService } from 'src/services/product.service'
import useQueryConfig from 'src/hooks/useQueryConfig'
import AsideFitter from './components/AsideFitter'
import Pagination from 'src/components/organisms/Pagination'
import SortProductList from './components/SortProductList'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.contexts'

const listProductData = [
  {
    name: 'Tía tô Hữu cơ',
    image: 'https://cdn.pixabay.com/photo/2015/05/04/10/16/vegetables-752153_640.jpg',
    price: 200000,
    price_before_discount: 200000,
    mass: 120,
    sold: 2600
  },
  {
    name: 'Tía tô Hữu cơ',
    image: 'https://cdn.pixabay.com/photo/2020/06/05/16/53/zucchini-5263781_640.jpg',
    price: 200000,
    price_before_discount: 200000,
    mass: 120,
    sold: 2600
  },
  {
    name: 'Tía tô Hữu cơ',
    image: 'https://cdn.pixabay.com/photo/2020/09/12/21/12/tomatoes-5566741_640.jpg',
    price: 200000,
    price_before_discount: 200000,
    mass: 120,
    sold: 2600
  },
  {
    name: 'Tía tô Hữu cơ',
    image: 'https://cdn.pixabay.com/photo/2016/11/02/16/51/broccoli-1792236_640.jpg',
    price: 200000,
    price_before_discount: 200000,
    mass: 120,
    sold: 2600
  },
  {
    name: 'Tía tô Hữu cơ',
    image: 'https://cdn.pixabay.com/photo/2018/09/25/20/09/bush-beans-3702999_640.jpg',
    price: 200000,
    price_before_discount: 200000,
    mass: 120,
    sold: 2600
  },
  {
    name: 'Tía tô Hữu cơ',
    image: 'https://cdn.pixabay.com/photo/2017/02/18/15/03/carrots-2077377_640.jpg',
    price: 200000,
    price_before_discount: 200000,
    mass: 120,
    sold: 2600
  },
  {
    name: 'Tía tô Hữu cơ',
    image: 'https://cdn.pixabay.com/photo/2017/09/07/21/31/vegetables-2726800_640.jpg',
    price: 200000,
    price_before_discount: 200000,
    mass: 120,
    sold: 2600
  },
  {
    name: 'Tía tô Hữu cơ',
    image: 'https://cdn.pixabay.com/photo/2016/11/19/10/40/woman-1838545_640.jpg',
    price: 200000,
    price_before_discount: 200000,
    mass: 120,
    sold: 2600
  },
  ,
  {
    name: 'Tía tô Hữu cơ',
    image: 'https://cdn.pixabay.com/photo/2016/05/06/11/46/tomatoes-1375740_640.jpg',
    price: 200000,
    price_before_discount: 200000,
    mass: 120,
    sold: 2600
  },
  {
    name: 'Tía tô Hữu cơ',
    image: 'https://cdn.pixabay.com/photo/2017/07/19/15/23/pumpkin-2519423_640.jpg',
    price: 200000,
    price_before_discount: 200000,
    mass: 120,
    sold: 2600
  }
]

export default function ProductList() {
  const queryConfig = useQueryConfig()
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryService.getCategories()
    }
  })

  const { data: productData } = useQuery({
    queryKey: ['product', queryConfig],
    queryFn: () => {
      return productService.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })

  return (
    <div className='container grid grid-cols-10 gap-7 my-10'>
      <div className='col-span-2'>
        <AsideFitter categories={categoriesData?.data.data} queryConfig={queryConfig} />
      </div>
      <div className='col-span-8 rounded-sm '>
        <SortProductList queryConfig={queryConfig} pageSize={productData?.data.data.pagination.page_size as number} />
        <div className='mt-4 grid-cols-2 grid md:grid-cols-3 lg:grid-cols-4 gap-5'>
          {productData?.data.data.products.map((item, index) => (
            <div key={index} className='col-span-1'>
              {item !== undefined && <ProductItem product={item} />}
            </div>
          ))}
        </div>
        <Pagination queryConfig={queryConfig} pageSize={productData?.data.data.pagination.page_size as number} />
      </div>
    </div>
  )
}
