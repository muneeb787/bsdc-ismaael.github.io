// Retrieve the order from localStorage
const orderSummary = JSON.parse(localStorage.getItem("orderSummary"));

// Check if the order exists
if (orderSummary) {
    const orderSummaryList = document.getElementById("orderSummaryList");
    
    // Add order details to the order summary list
    orderSummary.items.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} (${item.price})`;
        orderSummaryList.appendChild(listItem);
    });

    // Display the customer information
    document.getElementById("customerInfo").textContent = 
        `Name: ${orderSummary.name} | Email: ${orderSummary.email}`;
}

// Handle the payment method selection
document.querySelector(".paypal-button").addEventListener("click", function() {
    handlePayment("PayPal");
});

document.querySelector(".stripe-button").addEventListener("click", function() {
    handlePayment("Stripe");
});

// Simulate payment processing
function handlePayment(paymentMethod) {
    alert(`Processing payment with ${paymentMethod}...`);
    // You can integrate PayPal or Stripe API here to handle the actual payment

    // Clear the order data after payment
    localStorage.removeItem("orderSummary");
}
