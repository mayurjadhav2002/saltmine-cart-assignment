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

test("Add a product to the cart with quantity 0", async () => {
	await expect(addToCart("cornflakes", 0)).rejects.toThrow(
		"Quantity must be greater than 0"
	);
});

test("Add New Product to the cart", async () => {
	await addToCart("frosties", 1);
	const price = await getPrice("frosties");
	expect(cart["frosties"]).toEqual({
		name: "frosties",
		quantity: 1,
		price: price,
	});
});

test("Calculate the total", async () => {
	const total = calculateTotal();
	const subtotal = Object.values(cart).reduce(
		(acc, product) => acc + product.price * product.quantity,
		0
	);

	expect(total).toEqual({subtotal: subtotal, tax: 2.62, total: 23.58});
});

test("Dislay the output", async () => {
	console.log = jest.fn();

	displayOutput();

	expect(console.log).toHaveBeenCalledWith("cornflakes - $4.99 x 3");
	expect(console.log).toHaveBeenCalledWith("frosties - $5.99 x 1");
	expect(console.log).toHaveBeenCalledWith("Subtotal: 20.96");
	expect(console.log).toHaveBeenCalledWith("Tax: 2.62");
	expect(console.log).toHaveBeenCalledWith("Total: 23.58");
});

test("Calculate the total with no products in the cart", async () => {
    resetCart();
    const total = calculateTotal();
    expect(total).toEqual({subtotal: 0, tax: 0, total: 0});
});
