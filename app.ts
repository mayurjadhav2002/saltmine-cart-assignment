const TAX_RATE:number = 0.125;
const BACKEND_URL:string = "http://localhost:3001";
const Errors: Record<string, string> = {
	DEFAULT: "An error occurred",
	PRODUCT_NOT_FOUND: "Error fetching product price",
	PRODUCT_ADD: "Error adding product to cart",
	CALCULATE_TOTAL: "Error calculating total",
	DISPLAY_OUTPUT: "Error displaying output",
	QUANTITY_GREATER_THAN_ZERO: "Quantity must be greater than 0",
};


interface Cart {
	[productName: string]: Product;
}

interface Product {
	name: string;
	quantity: number;
	price: number;
}

interface TotalReturn {
	subtotal: number;
	tax: number;
	total: number;
}

const cart: Cart = {};


async function getProductPrice(productName: string): Promise<number> {
	try {
		const res = await fetch(`${BACKEND_URL}/products/${productName}`);
		if (!res.ok) {
			throw new Error("Error fetching product price");
		}
		const data = await res.json();
		return data.price;
	} catch (error) {
		throw new Error(Errors[error.message] || Errors.DEFAULT);
	}
}

async function addToCart(productName: string, quantity: number): Promise<void> {
	try {
		if (quantity <= 0) {
			throw new Error("QUANTITY_GREATER_THAN_ZERO");
		}

		if (cart[productName]) {
			cart[productName].quantity += quantity;
			return;
		}

		const price = await getProductPrice(productName);
		cart[productName] = {name: productName, quantity, price};
	} catch (error) {
		throw new Error(Errors[error.message] || Errors.DEFAULT);
	}
}

const calculateTotal = (): TotalReturn => {
	try {
		const subtotal = Object.values(cart).reduce(
			(acc, item) => acc + item.price * item.quantity,
			0
		);
		const tax = Math.ceil(subtotal * TAX_RATE * 100) / 100;
		const total = Math.ceil((subtotal + tax) * 100) / 100;
		return {subtotal, tax, total};
	} catch (error) {
		throw new Error(Errors["CALCULATE_TOTAL"] || Errors.DEFAULT);
	}
};

const displayOutput = (): void => {
	try {
		Object.values(cart).forEach((item) => {
			console.log(
				`${item.name} - $${item.price.toFixed(2)} x ${item.quantity}`
			);
		});

		const {subtotal, tax, total} = calculateTotal();
		console.log(`Subtotal: ${subtotal}`);
		console.log(`Tax: ${tax}`);
		console.log(`Total: ${total}`);
	} catch (error) {
		throw new Error(Errors["DISPLAY_OUTPUT"] || Errors.DEFAULT);
	}
};

const resetCart = (): void => {
	Object.keys(cart).forEach((key) => {
		delete cart[key];
	});
};

//For Testing
// (async()=>{
//     try {
//         await addToCart("cornflakes", 1);
//         await addToCart("cornflakes", 2);
//         await addToCart("frosties", 1);
//         displayOutput();
//         resetCart();
//     } catch (error) {
//         console.log(error.message);
//     }
// })();


export {addToCart, calculateTotal, displayOutput, resetCart, cart};
