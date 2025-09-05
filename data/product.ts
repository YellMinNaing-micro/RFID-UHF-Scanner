// app/data/products.ts
export interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    oldPrice?: string;
    discount?: number;
    rating: number;
    reviews?: number;
    boughtCount?: number;
    image: any; // require() or URI
}

export const products: Product[] = [
    {
        id: "1",
        name: "The Paanita Ring",
        description: "Sterling Silver 1s Silver Alloy",
        price: "556.19",
        oldPrice: "654.34",
        discount: 15,
        rating: 4,
        reviews: 8,
        boughtCount: 434,
        image: require("../assets/images/my-pics/1.png"),
    },
    {
        id: "2",
        name: "Sterling Silver",
        description: "Sterling Silver 1s Silver Alloy",
        price: "84.99",
        oldPrice: "99.99",
        discount: 12,
        rating: 5,
        reviews: 23,
        boughtCount: 120,
        image: require("../assets/images/my-pics/2.png"),
    },
    {
        id: "3",
        name: "Golden Ruby Ring",
        description: "Sterling Silver 1s Silver Alloy",
        price: "249.00",
        oldPrice: "310.00",
        discount: 20,
        rating: 4,
        reviews: 42,
        boughtCount: 310,
        image: require("../assets/images/my-pics/3.png"),
    },
    {
        id: "4",
        name: "လက်စွပ်",
        description: "အောင်ရဲလင်းလက်စွပ်",
        price: "180.00",
        oldPrice: "220.00",
        discount: 18,
        rating: 5,
        reviews: 15,
        boughtCount: 56,
        image: require("../assets/images/my-pics/ring.png"),
    },
    {
        id: "5",
        name: "Sterling Silver",
        description: "Sterling Silver 1s Silver Alloy",
        price: "84.99",
        oldPrice: "220.00",
        discount: 18,
        rating: 5,
        reviews: 15,
        boughtCount: 56,
        image: require("../assets/images/my-pics/1.png"),
    },
    {
        id: "6",
        name: "Sterling Silver",
        description: "Sterling Silver 1s Silver Alloy",
        price: "84.99",
        oldPrice: "220.00",
        discount: 18,
        rating: 5,
        reviews: 15,
        boughtCount: 56,
        image: require("../assets/images/my-pics/2.png"),
    },
    {
        id: "7",
        name: "Sterling Silver",
        description: "Sterling Silver 1s Silver Alloy",
        price: "84.99",
        oldPrice: "220.00",
        discount: 18,
        rating: 5,
        reviews: 15,
        boughtCount: 56,
        image: require("../assets/images/my-pics/3.png"),
    },
];
