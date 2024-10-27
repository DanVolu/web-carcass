import { useEffect, useState } from "react";
import axios from "axios";

export interface CartItemProps {
    productId: number;
    quantity: number;
    total?: { $numberDecimal: string };
    pricePerItem?: number;
    totalPrice?: number;
  }

interface ProductProps {
  name: string;
  image: string;
}

  export default function CartItem({ productId, quantity, pricePerItem, totalPrice }: CartItemProps) {
    const [product, setProduct] = useState<ProductProps | undefined>(undefined);

    useEffect(() => {
      const loadProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:7000/api/v1/products/${productId}`);
          setProduct(response.data.data);
        }
        catch (err) {
          console.log(err);
        }
      }

      loadProduct();
    })

    return (
      <div className="flex items-center space-x-4 p-4 border-b">
      <img src={product?.image} alt={product?.name} className="w-16 h-16 object-cover" />
      <div className="flex-1">
        <h2 className="font-semibold text-lg">{product?.name}</h2>
        <p>Quantity: {quantity}</p>
        <p>Price per item: €{pricePerItem?.toFixed(2)}</p>
      </div>
      <div>
        <p className="font-semibold">Total: €{totalPrice?.toFixed(2)}</p>
      </div>
    </div>
    )
  }