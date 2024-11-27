import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PurchasePage: React.FC = () => {
  const [cardType, setCardType] = useState("Visa");
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [pickupLocation, setPickupLocation] = useState("Gedimino pr. 9");
  const [agreed, setAgreed] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchCartTotal = async () => {
    try {
      const { data } = await axios.get("http://localhost:7000/api/v1/cart", { withCredentials: true });
      setTotalPrice(data.cart.total);
    } catch (err: any) {
      setError("Error fetching total price. Please try again.");
    }
  };

  useEffect(() => {
    fetchCartTotal();
  }, []);

  const formatCardNumber = (number: string) => {
    return number
      .replace(/\D/g, "") // Remove non-numeric characters
      .replace(/(.{4})/g, "$1 ") // Add space every 4 digits
      .trim(); // Remove trailing space
  };

  const validateCardDetails = () => {
    const cardNumberRegex = /^\d{13,19}$/; // 13 to 19 digits (without spaces)
    const nameRegex = /^[a-zA-Z\s]+$/; // Alphabetic and spaces only
    const cvvRegex = /^\d{3,4}$/; // 3 or 4 digits

    const unformattedCardNumber = cardNumber.replace(/\s+/g, ""); // Remove spaces for validation

    if (!cardNumberRegex.test(unformattedCardNumber)) {
      setError("Invalid card number. Please enter 13-19 digits.");
      return false;
    }
    if (!nameRegex.test(cardholderName)) {
      setError("Invalid cardholder name. Only letters and spaces are allowed.");
      return false;
    }
    if (!cvvRegex.test(cvv)) {
      setError("Invalid CVV. Please enter 3 or 4 digits.");
      return false;
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed
    const expiryYearFull = parseInt(`20${expiryYear}`, 10);
    const expiryMonthInt = parseInt(expiryMonth, 10);

    if (
      expiryYearFull < currentYear ||
      (expiryYearFull === currentYear && expiryMonthInt < currentMonth)
    ) {
      setError("Invalid expiry date. The expiry date must be in the future.");
      return false;
    }

    setError(null); // Clear any previous errors
    return true;
  };

  const handlePurchase = async () => {
    if (!validateCardDetails()) {
      return;
    }

    if (!agreed) {
      setError("You must accept the terms and conditions before proceeding.");
      return;
    }

    try {
      await axios.delete("http://localhost:7000/api/v1/cart/clear", { withCredentials: true });
      alert(`Purchase completed successfully! Your package will be available at ${pickupLocation}.`);
      navigate("/"); // Redirect to homepage or any other page
    } catch (err: any) {
      alert("Error completing purchase. Please try again.");
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const years = Array.from({ length: 12 }, (_, i) => (new Date().getFullYear() + i).toString());
  const pickupLocations = [
    "Gedimino pr. 9",
    "Konstitucijos pr. 12",
    "Pilies g. 5",
    "Ozo g. 18",
    "Ukmergės g. 369",
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Purchase</h1>
      <div className="space-y-4 max-w-md mx-auto">
        <p className="text-lg font-semibold">
          Total Price: {totalPrice !== null ? `$${totalPrice.toFixed(2)}` : "Loading..."}
        </p>
        <div>
          <label className="block mb-2 font-semibold">Type of Card</label>
          <select
            className="w-full p-2 border rounded outline-gray-300"
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
          >
            <option value="Visa">Visa</option>
            <option value="MasterCard">MasterCard</option>
            <option value="American Express">American Express</option>
            <option value="Discover">Discover</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 font-semibold">Card Number</label>
          <input
            type="text"
            className="w-full p-2 border rounded outline-gray-300"
            placeholder="Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Name on Card</label>
          <input
            type="text"
            className="w-full p-2 border rounded outline-gray-300"
            placeholder="Name on Card"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
          />
        </div>
        <div className="flex space-x-4">
          <div>
            <label className="block mb-2 font-semibold">Start Date</label>
            <div className="flex space-x-2">
              <select
                className="p-2 border rounded outline-gray-300"
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
              >
                <option value="">MM</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                className="p-2 border rounded outline-gray-300"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
              >
                <option value="">YY</option>
                {years.map((year) => (
                  <option key={year} value={year.slice(-2)}>
                    {year.slice(-2)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-2 font-semibold">Expiry Date</label>
            <div className="flex space-x-2">
              <select
                className="p-2 border rounded outline-gray-300"
                value={expiryMonth}
                onChange={(e) => setExpiryMonth(e.target.value)}
              >
                <option value="">MM</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                className="p-2 border rounded outline-gray-300"
                value={expiryYear}
                onChange={(e) => setExpiryYear(e.target.value)}
              >
                <option value="">YY</option>
                {years.map((year) => (
                  <option key={year} value={year.slice(-2)}>
                    {year.slice(-2)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div>
          <label className="block mb-2 font-semibold">Security Code (CVV)</label>
          <input
            type="text"
            className="w-full p-2 border rounded outline-gray-300"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Pickup Location</label>
          <select
            className="w-full p-2 border rounded outline-gray-300"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
          >
            {pickupLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            className="mr-2"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
          />
          <label htmlFor="terms" className="text-gray-700">
            I agree with the terms and conditions
          </label>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 w-full"
          onClick={handlePurchase}
        >
          Complete Purchase
        </button>
      </div>
    </div>
  );
};

export default PurchasePage;
