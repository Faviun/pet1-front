import { useUnit } from 'effector-react'
import { useEffect, useState } from 'react'
import { removeFromCartFx } from '@/lib/api/shopping-cart'
import { removeItemFromCart, updateTotalPrice } from '@/lib/utils/shopping-cart'

export const usePrice = (
  count: number,
  partId: number,
  initialPrice: number
) => {
  const spinner = useUnit(removeFromCartFx.pending)
  const [price, setPrice] = useState(initialPrice * count)

  useEffect(() => {
    updateTotalPrice(price, partId)
  }, [price, partId])

  const increasePrice = () => setPrice(price + initialPrice)
  const decreasePrice = () => setPrice(price - initialPrice)
  const deleteCartItem = () => removeItemFromCart(partId)

  return { price, spinner, increasePrice, decreasePrice, deleteCartItem }
}
