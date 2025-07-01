import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from './CartSlice';
import './CartItem.css';

const CartItem = ({ onContinueShopping }) => {
  const cart = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  // Helper function to safely parse cost string to number (defined once at the top level)
  const parseCost = (costString) => {
    // Check if costString is already a number to avoid errors
    if (typeof costString === 'number') {
      return costString;
    }
    // Removes '$' and then parses to a float. If parsing fails, defaults to 0.
    return parseFloat(costString.replace('$', '')) || 0;
  };

  // Calculate total amount for all products in the cart
  const calculateTotalAmount = () => {
    let total = 0; // Initialize a variable total to hold the cumulative sum.

    // Iterate over the cart array using cart.forEach().
    cart.forEach(item => {
      // For each item, extract its quantity and cost.
      const quantity = item.quantity;
      const cost = parseCost(item.cost); // Use the helper to convert the cost string to a number

      // Multiply it by the quantity.
      // Add the resulting value to total.
      total += quantity * cost;
    });

    // After processing all items, return the final total sum.
    return total.toFixed(2); // Formats to 2 decimal places for currency display.
  };

  const handleContinueShopping = (e) => {
    e.preventDefault(); // Prevents the default action of the event
    onContinueShopping(true); // Call the function passed as a prop from the parent component
  };

  const handleIncrement = (item) => {
    // Dispatch updateQuantity action with incremented quantity
    dispatch(updateQuantity({ name: item.name, quantity: item.quantity + 1 }));
  };

  const handleDecrement = (item) => {
    // If the item's quantity is greater than 1, dispatch updateQuantity to decrease the quantity by 1.
    if (item.quantity > 1) {
      dispatch(updateQuantity({ name: item.name, quantity: item.quantity - 1 }));
    }
    // Else if the quantity would drop to 0, dispatch the removeItem action to remove the plant type from the cart.
    else {
      dispatch(removeItem(item.name));
    }
  };

  const handleRemove = (item) => {
    // Dispatch removeItem action with the item's name
    dispatch(removeItem(item.name));
  };

  // Calculate total cost based on quantity for an item (defined once at the top level)
  const calculateTotalCost = (item) => {
    // Extract the numeric value from the item's cost string
    const unitPrice = parseCost(item.cost); // Use the helper function

    // Multiply its quantity with its unit price
    const subtotal = item.quantity * unitPrice;

    // Return the formatted subtotal
    return subtotal.toFixed(2); // Format to 2 decimal places for currency
  };

  return (
    <div className="cart-container">
      <h2 style={{ color: 'black' }}>Total Cart Amount: ${calculateTotalAmount()}</h2>
      <div>
        {cart.length === 0 ? (
          <p style={{ color: 'black', textAlign: 'center', marginTop: '20px' }}>Your cart is empty.</p>
        ) : (
          cart.map(item => (
            <div className="cart-item" key={item.name}>
              <img className="cart-item-image" src={item.image} alt={item.name} />
              <div className="cart-item-details">
                <div className="cart-item-name">{item.name}</div>
                {/* Display item cost. Assume item.cost might still be a string here. */}
                <div className="cart-item-cost">Price: {typeof item.cost === 'number' ? `$${item.cost.toFixed(2)}` : item.cost}</div>
                <div className="cart-item-quantity">
                  <button className="cart-item-button cart-item-button-dec" onClick={() => handleDecrement(item)}>-</button>
                  <span className="cart-item-quantity-value">{item.quantity}</span>
                  <button className="cart-item-button cart-item-button-inc" onClick={() => handleIncrement(item)}>+</button>
                </div>
                <div className="cart-item-total">Total: ${calculateTotalCost(item)}</div>
                <button className="cart-item-delete" onClick={() => handleRemove(item)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
      <div style={{ marginTop: '20px', color: 'black' }} className='total_cart_amount'></div>
      <div className="continue_shopping_btn">
        <button className="get-started-button" onClick={handleContinueShopping}>Continue Shopping</button>
        <br />
        <button className="get-started-button1">Checkout</button>
      </div>
    </div>
  );
};

export default CartItem;