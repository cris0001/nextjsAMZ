export interface Item {
  _id: string;
  name?: string;
  slug: string;
  category: string;
  image: string;
  price: string;
  brand: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  description: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
  quantity?: number;
}

export interface UserS {
  email: string;
  isAdmin: boolean;
  name: string;
  token: string;
  _id: string;
}

export interface Ord {
  orderItems: [
    {
      name: string;
      quantity: number;
      image: string;
      price: number;
    }
  ];
  shippingAddress: {
    fullName: String;
    address: String;
    city: String;
    postalCode: String;
    country: String;
  };
  paymentMethod: String;
  itemsPrice: Number;
  shippingPrice: Number;
  totalPrice: Number;
  isPaid: Boolean;
  isDelivered: Boolean;
  paidAt: Date;
  deliveredAt: Date;
  user: string;
  _id: string;
  createdAt: Date;
}
