// Stripe publishable key
const stripe = Stripe('pk_test_51QOgcwAWI44r05bC9xKGFmvEI6bhq1CVjxcTEQ1swqa0fMbW953QXSRyuhXMzSBU5Xw0Xt98GqrwFihE01EfC9oM00NH0yA5ZU'); // Your Stripe public key

// Menu Items with Prices
const menuItems = {
    breakfast: [
        { name: 'Desi Breakfast', price: 6.50 },
        { name: 'English Breakfast', price: 6.50 },
        { name: 'Puri Breakfast', price: 6.50 }
    ],
    paratha: [
        { name: 'Classic Paratha', price: 2.00 },
        { name: 'Aloo Paratha', price: 3.00 },
        { name: 'Keema Paratha', price: 3.50 },
        { name: 'Nutella Paratha', price: 2.50 }
    ],
    wraps: [
        { name: 'Desi Wrap', price: 4.50 }
    ],
    hotDrinks: [
        { name: 'Classic Karak', price: 2.50 },
        { name: 'Masala Chai', price: 2.50 },
        { name: 'Doodh Patti', price: 2.50 },
        { name: 'Haldi Milk', price: 2.50 }
    ],
    extras: [
        { name: 'Puri', price: 1.50 },
        { name: 'Lahori Channa', price: 2.50 },
        { name: 'Halwa', price: 3.00 },
        { name: 'Masala Beans', price: 2.00 },
        { name: 'Chicken Sausage', price: 1.50 },
        { name: 'Hashbrown', price: 1.50 }
    ]
};

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
        const itemDetails = {
            name: selectedItem,
            category: selectedCategory,
            price: menuItems[selectedCategory].find(item => item.name === selectedItem).price
        };

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(itemDetails);
        localStorage.setItem('cart', JSON.stringify(cart));

        updateCart();
    }
});

// Update the cart display
function updateCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.getElementById("cartList");
    cartList.innerHTML = '';

    if (cart.length === 0) {
        cartList.innerHTML = '<li>Your cart is empty.</li>';
    } else {
        cart.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${item.name} (£${item.price})`;

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.onclick = () => {
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            };

            listItem.appendChild(removeButton);
            cartList.appendChild(listItem);
        });
    }
}

// Stripe Checkout Button
document.getElementById("checkout-button").addEventListener("click", function () {
    const totalAmount = calculateTotalAmount(); // Calculate the total price of items in cart

    // Redirect the user to the Stripe payment page (Using your Stripe Payment Link)
    window.location.href = 'https://buy.stripe.com/test_cN2bJycdKf1genScMM'; // This is your generated Stripe payment link
});

// Calculate total amount
function calculateTotalAmount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.reduce((total, item) => total + item.price, 0); // Sum up prices
}
