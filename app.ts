const TAX_RATE = 0.125;
const PRICE_API = "/api/product"
const BACKEND_URL = "http://localhost:3001"

interface Cart{
    name: string,
    quantity: number,
    price: number
}

interface TotalReturn {
    subtotal: number,
    tax: number,
    total: number
}

const cart: Cart[] = [];

async function getProductPrice(productName: string): Promise<number>{
    try {
        const res = await fetch(`${BACKEND_URL}/products/${productName}`)
        if(!res.ok){
            throw new Error("Error fetching product price")
        }
        const data = await res.json()
        return data.price;
    } catch (error) {
        throw new Error("Error fetching product price")
    }
}

async function addToCart(productName:string, quantity:number): Promise<void>{
    try {
        if(quantity <= 0) {
            throw new Error("Quantity must be greater than 0")
        }
        const price = await getProductPrice(productName)
        cart.push({name: productName, quantity, price})
    } catch (error) {
        throw new Error("Error adding product to cart")
    }
}

const calculateTotal = (): TotalReturn => {
    try {
        const subtotal = cart.reduce((acc, item)=>acc+item.price * item.quantity, 0);
        const tax = Math.ceil(subtotal * TAX_RATE * 100) / 100;
        const total = Math.ceil((subtotal + tax) * 100) / 100;
        return {subtotal, tax, total}
    } catch (error) {
        throw new Error("Error calculating total")
    }
}


const displayOutput = (): void =>{
    try {
        cart.forEach(item => {
            console.log(`${item.name} - ${item.quantity} - ${item.price}`)
        });
    
        const {subtotal, tax, total} = calculateTotal();
        console.log(`Subtotal: ${subtotal}`);
        console.log(`Tax: ${tax}`);
        console.log(`Total: ${total}`);
    } catch (error) {
        throw new Error("Error displaying output")
    }
}


(async () => {
    try {
        await addToCart('cornflakes', 1);
        await addToCart('cornflakes', 1);
        await addToCart('weetabix', 1);
        displayOutput();
    } catch (error) {
        console.error(error.message);
    }
})();
