// src/features/cart/cartSlice.js (or CartSlice.jsx)
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

export const CartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            const { name, image, cost } = action.payload;

            // --- IMPORTANT: Convert cost to a number here ---
            const numericCost = parseFloat(cost.replace('$', '')); // Remove '$' and parse to float

            const existingItem = state.items.find(item => item.name === name);

            if (existingItem) {
                existingItem.quantity++;
                existingItem.totalPrice += numericCost; // Update totalPrice
            } else {
                state.items.push({
                    name,
                    image,
                    cost: numericCost, // Store as a number
                    quantity: 1,
                    totalPrice: numericCost // Initial totalPrice
                });
            }
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item.name !== action.payload);
        },
        updateQuantity: (state, action) => {
            const { name, quantity } = action.payload;
            const itemToUpdate = state.items.find(item => item.name === name);
            if (itemToUpdate) {
                // Update quantity and recalculate total price for this item
                itemToUpdate.quantity = quantity;
                // Assuming you have the original 'cost' as a number now
                itemToUpdate.totalPrice = itemToUpdate.cost * quantity;
            }
        },
    },
});

export const { addItem, removeItem, updateQuantity } = CartSlice.actions;
export default CartSlice.reducer;