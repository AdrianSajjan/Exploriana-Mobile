import { useConfig } from "@exploriana/api/config";
import { stripe } from "@exploriana/config/api";
import { stripeSecretKey } from "@exploriana/config/app";
import { PaymentIntent } from "@exploriana/interface/stripte";
import { useMutation } from "@tanstack/react-query";

export function useCreatePaymentIntent() {
  const config = useConfig();

  return useMutation({
    mutationFn: async ({ amount }: { amount: number }) => {
      const secret = await config.getAsync(stripeSecretKey);
      const body = `amount=${amount}&currency=INR&automatic_payment_methods[enabled]=true`;
      const response = await stripe.post<PaymentIntent>("https://api.stripe.com/v1/payment_intents", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: secret,
          password: "",
        },
      });
      return response.data;
    },
  });
}
