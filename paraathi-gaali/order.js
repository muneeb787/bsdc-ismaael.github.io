// Menu Items with Prices
const menuItems = {
    breakfast: [
        { name: 'Desi Breakfast', price: '6.50' },
        { name: 'English Breakfast', price: '6.50' },
        { name: 'Puri Breakfast', price: '6.50' }
    ],
    paratha: [
        { name: 'Classic Paratha', price: '2.00' },
        { name: 'Aloo Paratha', price: '3.00' },
        { name: 'Keema Paratha', price: '3.50' },
        { name: 'Nutella Paratha', price: '2.50' }
    ],
    wraps: [
        { name: 'Desi Wrap', price: '4.50' },
    ],
    hotDrinks: [
        { name: 'Classic Karak', price: '2.50' },
        { name: 'Masala Chai', price: '2.50' },
        { name: 'Doodh Patti', price: '2.50' },
        { name: 'Haldi Milk', price: '2.50' }
    ],
    extras: [
        { name: 'Puri', price: '1.50' },
        { name: 'Lahori Channa', price: '2.50' },
        { name: 'Halwa', price: '3.00' },
        { name: 'Masala Beans', price: '2.00' },
        { name: 'Chicken Sausage', price: '1.50' },
        { name: 'Hashbrown', price: '1.50' }
    ]
};

// Cart to hold selected items
let cart = [];

// Populate the category items dropdown based on the selected category
function populateCategoryDropdown(category) {
    const categoryItems = menuItems[category];
    const categoryDropdown = document.getElementById("categoryItems");

    // Clear the current dropdown options
    categoryDropdown.innerHTML = '';

    // Add new options
    categoryItems.forEach(item => {
        const option = document.createElement("option");
        option.value = item.name;
        option.textContent = `${item.name} - £${item.price}`;
        categoryDropdown.appendChild(option);
    });
}

// Handle category selection and show the additional item dropdown
document.getElementById("mealCategory").addEventListener("change", function () {
    const category = this.value;

    if (category) {
        // Show additional options dropdown
        document.getElementById("additionalOptions").style.display = "block";
        populateCategoryDropdown(category);
    } else {
        // Hide additional options dropdown
        document.getElementById("additionalOptions").style.display = "none";
    }
});

// Add the selected item to the cart
document.getElementById("addToCart").addEventListener("click", function () {
    const selectedItem = document.getElementById("categoryItems").value;
    const selectedCategory = document.getElementById("mealCategory").value;

    if (selectedItem) {
        // Add to cart
        const itemDetails = {
            name: selectedItem,
            category: selectedCategory,
            price: menuItems[selectedCategory].find(item => item.name === selectedItem).price
        };

        cart.push(itemDetails);

        // Display cart items
        updateCart();
    }
});

// Update the cart display
function updateCart() {
    const cartList = document.getElementById("cartList");
    cartList.innerHTML = '';  // Clear current cart items

    if (cart.length === 0) {
        cartList.innerHTML = '<li>Your cart is empty.</li>';
    } else {
        cart.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${item.name} (£${item.price})`;

            // Remove from cart button
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.onclick = () => {
                cart.splice(index, 1); // Remove the item from the cart array
                updateCart(); // Re-render the cart
            };

            listItem.appendChild(removeButton);
            cartList.appendChild(listItem);
        });
    }
}

// Handle Stripe Checkout
const stripe = Stripe('pk_test_51QOgcwAWI44r05bC9xKGFmvEI6bhq1CVjxcTEQ1swqa0fMbW953QXSRyuhXMzSBU5Xw0Xt98GqrwFihE01EfC9oM00NH0yA5ZU');  // Replace with your actual Stripe publishable key

document.getElementById("checkout-button").addEventListener("click", function () {
    console.log("Proceed to Payment clicked");  // Check if the button click is detected
    const totalAmount = calculateTotalAmount();  // Calculate the total price of items in cart

    fetch('http://localhost:3000/create-checkout-session', {  // Ensure this matches
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: totalAmount * 100, currency: 'GBP' }),  // Convert amount to cents
    })        
    .then((response) => response.json())
    .then((session) => {
        console.log("Session received: ", session);  // Check the session object returned
        stripe.redirectToCheckout({ sessionId: session.id });
    })
    .catch((error) => console.error('Error:', error));
});

// Calculate total amount
function calculateTotalAmount() {
    return cart.reduce((total, item) => total + parseFloat(item.price), 0);  // Sum up prices
}
