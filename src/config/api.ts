import axios from "axios";

export const stripe = axios.create({
  baseURL: "https://api.stripe.com",
});
