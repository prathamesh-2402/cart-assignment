import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Toast from "@/utils/Toast";
import axios from "axios"
import { LogOut, ShoppingCart, Star } from "lucide-react";
import { useEffect, useState } from "react"

interface Product {
  title: string;
  description: string;
  price: number;
  rating: number;
  thumbnail: string;
}

const ProductCard = ({ title, description, price, rating, imageUrl, cartItems, setCartItems }: any) => {

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <div className="relative">
        <img className="object-cover object-center w-full h-56" src={imageUrl} alt={title} />
      </div>
      <div className="p-6 flex flex-col">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 truncate">{title}</h3>
          <p className="text-gray-600 my-1 truncate">{description}</p>
          <div className="flex justify-between items-center mt-4">
            <div>
              <span className="text-gray-900 font-bold text-xl">${price.toFixed(2)}</span>
              <span className="line-through text-sm text-gray-400 ml-2">${(price * 1.1296).toFixed(2)}</span>
            </div>
            <div className="flex items-center">
              <Star className="text-yellow-500 text-xs" size={18} />
              <span className="text-gray-600 ml-1">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        <button
          className="w-full bg-black text-white mt-6 py-2 rounded hover:bg-gray-900 transition-colors duration-300"
          onClick={() => {
            setCartItems({ count: cartItems?.count + 1, itemsList: [...cartItems?.itemsList, { title, price, imageUrl }] });
            console.log(cartItems);
          }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const [product, setProduct] = useState([]);
  const [filtering, setFiltering] = useState(false);
  const [filter, setFilter] = useState({
    low: 0,
    high: 0
  });
  const name = localStorage.getItem('name');
  const [page, setPage] = useState({ limit: 8, skip: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState({ count: 0, itemsList: [] });

  const handlePageChange = (page: number) => {
    setPage({ limit: 8, skip: page });
  }

  const onSubmit = async (query?: string) => {
    try {
      axios.get(`https://dummyjson.com/products/search?&q=${query}`)
        .then(res => setProduct(res?.data?.products))
    } catch (error: any) {
      Toast({ message: error.response.data.message, type: "error" })
    }
  }

  const onFilter = async () => {
    if(filter.low == 0  && filter.high  == 0) {
      Toast({ message: "Please select price range", type: "error" })
      return;
    }
    try {
      axios.get(`https://dummyjson.com/products?limit=0`)
        .then(res => setProduct(res?.data?.products?.filter((itm: any) => {
          if (itm?.price >= filter.low && itm?.price <= filter.high) {
            return itm;
          }
        })))
    } catch (error: any) {
      Toast({ message: error.response.data.message, type: "error" })
    }
  }

  useEffect(() => {
    try {
      axios.get(`https://dummyjson.com/products?limit=${page.limit}&skip=${page.skip}`)
        .then(res => setProduct(res?.data?.products))
    } catch (error: any) {
      Toast({ message: error.response.data.message, type: "error" })
    }
  }, [page])

  return (
    <div className="py-8 px-4 lg:px-14 flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">Welcome, {name}</h1>
        <div className="md:flex w-full max-w-sm items-center space-x-2 hidden">
          <Input type="search" placeholder="Search here" value={searchQuery} onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value == "") {
              setPage({ limit: 8, skip: 0 })
            }
          }} />
          <Button type="submit" onClick={() => { onSubmit(searchQuery) }}>Search</Button>
        </div>
        <div className="flex gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <div className="relative">
                {cartItems.count > 0
                  && <h1 className="absolute top-[-4px] right-0 text-[10px] bg-red-500 text-white px-1 rounded-full">{cartItems.count}</h1>
                }
                <ShoppingCart className="cursor-pointer" />
              </div>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Cart</SheetTitle>
                <SheetDescription>
                  Check Your Cart items.
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col justify-between gap-4 py-4">
                {cartItems?.itemsList.map((cartItems: any, key) => (
                  <div className="flex items-center" key={key}>
                    <div className="relative">
                      <img className="object-cover object-center w-12 h-12" src={cartItems?.imageUrl} alt={cartItems?.title} />
                    </div>
                    <div className="px-4 py-2 flex flex-col">
                      <div>
                        <h3 className="font-semibold text-gray-900 truncate">{cartItems?.title}</h3>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-gray-900 text-md">${cartItems?.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <Label htmlFor="username" className="text-right text-xl">
                    Total
                  </Label>
                  <h1 className="font-semibold">${cartItems?.itemsList?.reduce((total: number, item: any) => total + item?.price, 0)}</h1>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit">Checkout</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <LogOut className="cursor-pointer text-red-600" onClick={() => {localStorage.removeItem("token"); window.location.reload()}} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex w-full max-w-sm items-center space-x-2 md:hidden">
          <Input type="search" placeholder="Search here" value={searchQuery} onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value == "") {
              setPage({ limit: 8, skip: 0 })
            }
          }} />
          <Button type="submit" onClick={() => { onSubmit(searchQuery) }}>Search</Button>
        </div>
        <div className="flex flex-row gap-2">
          <Input className="w-[20%]" type="number" value={filter.low} onChange={e => setFilter({ ...filter, low: Number(e.target.value) })} /> -
          <Input className="w-[20%]" type="number" value={filter.high} onChange={e => setFilter({ ...filter, high: Number(e.target.value) })} />
          <Button type="submit" onClick={() => { onFilter(); setFiltering(true) }}>Filter</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mt-4 xl:px-24">
        {
          product.map((product: Product, key) => (
            <ProductCard
              key={key}
              title={product?.title}
              description={product?.description}
              price={product?.price}
              rating={product?.rating}
              imageUrl={product?.thumbnail}
              setCartItems={setCartItems}
              cartItems={cartItems}
            />
          ))
        }
      </div>
      {filtering && <h1 className="text-center">The List Ends here</h1>}
      {!filtering &&
        <Pagination>
          <PaginationContent>
            <PaginationItem className="cursor-pointer">
              <PaginationPrevious onClick={() => handlePageChange(page.skip - 1 * page.limit)} />
            </PaginationItem>
            <PaginationItem className="cursor-default">
              <PaginationLink>{page.skip / page.limit + 1}</PaginationLink>
            </PaginationItem>
            <PaginationItem className="cursor-pointer">
              <PaginationNext onClick={() => handlePageChange(page.skip + 1 * page.limit)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      }
    </div>
  )
}

export default Home