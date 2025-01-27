import { BsStarFill } from 'react-icons/bs'

export default function ProductRating({ rating }: { rating: number }) {
  const handleWithStar = (order: number) => {
    if (order <= rating) {
      return '100%'
    }
    if (order > rating) {
      return `${(rating - Math.floor(rating)) * 100}%`
    }
    return '0%'
  }
  return (
    <div className='flex'>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div key={index} className='relative'>
            <div
              style={{ width: handleWithStar(index + 1) }}
              className={`absolute left-0 top-0 right-0 bottom-0 h-full overflow-hidden`}
            >
              <BsStarFill className='mr-[2px] text-[12px] text-yellow-400' />
            </div>
            <BsStarFill className='mr-[2px] text-[12px] text-gray-300' />
          </div>
        ))}
    </div>
  )
}
