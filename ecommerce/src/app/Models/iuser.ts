export interface iUser {
  id: number
  firstName: string
  lastName: string
  email: string
  password: string
  cart: number[]
  wishlist: number[]
  admin: boolean
}
