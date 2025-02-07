import {addToCart, calculateTotal, cart, displayOutput, resetCart} from "./app";
beforeEach(()=>{
    jest.clearAllMocks();
})
async function getPrice(productName: string): Promise<number> {
	try {
		const res = await fetch(
			`http://localhost:3001/products/${productName}`
		);
		if (!res.ok) {
			throw new Error("Error fetching product price");
		}
		const data = await res.json();
		return data.price;
	} catch (error) {
		return null;
	}
}

test("Add a product to the cart", async () => {
	await addToCart("cornflakes", 1);
	const price = await getPrice("cornflakes");
	expect(cart["cornflakes"]).toEqual({
		name: "cornflakes",
		quantity: 1,
		price: price,
	});
});

test("Add a product to the cart that already exists", async () => {
	await addToCart("cornflakes", 2);
	const price = await getPrice("cornflakes");
	expect(cart["cornflakes"]).toEqual({
		name: "cornflakes",
		quantity: 3,
		price: price,
	});
});
 