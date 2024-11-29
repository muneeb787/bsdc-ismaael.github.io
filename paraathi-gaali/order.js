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

// Function to populate the category items dropdown based on selected category
function populateCategoryDropdown(category) {
    const categoryItems = menuItems[category];
    const categoryDropdown = document.getElementById("categoryItems");

    // Clear the current dropdown options
    categoryDropdown.innerHTML = '';

    // Add new options for the selected category
    categoryItems.forEach(item => {
        const option = document.createElement("option");
        option.value = item.name;
        option.textContent = `${item.name} - £${item.price}`;
        categoryDropdown.appendChild(option);
    });
}

// Handle category selection
document.getElementById("mealCategory").addEventListener("change", function () {
    const category = this.value;

    if (category) {
        // Show additional options dropdown
        document.getElementById("additionalOptions").style.display = "block";
        populateCategoryDropdown(category);
    } else {
        // Hide additional options dropdown if no category selected
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

        updateCart();  // Update cart display after adding
    }
});

// Update the cart display
function updateCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.getElementById("cartList");
    const totalAmount = calculateTotalAmount();
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
                updateCart();  // Re-update the cart
            };

            listItem.appendChild(removeButton);
            cartList.appendChild(listItem);
        });

        document.getElementById("totalAmount").textContent = `Total: £${totalAmount.toFixed(2)}`;
    }
}

// Calculate total amount
function calculateTotalAmount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.reduce((total, item) => total + item.price, 0); // Sum up prices
}

// Checkout Function
async function createCheckoutSession() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    try {
        const response = await fetch('http://localhost:4242/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cart }),
        });

        const session = await response.json();

        if (session.url) {
            localStorage.removeItem('cart'); // Clear the cart before redirecting
            window.location.href = session.url; // Redirect to Stripe Checkout
        } else {
            alert('Failed to create checkout session');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the checkout session.');
    }
}

// Add event listener to the checkout button
document.getElementById("checkoutButton").addEventListener("click", createCheckoutSession);

// Initialize cart display on page load
updateCart();
