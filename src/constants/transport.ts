export type TravelClass = (typeof travelClassCards)[0];

export const travelClassCards = [
  {
    type: "standard",
    name: "Standard",
    price: {
      train: 0,
      flight: 0,
      bus: 0,
    },
    facilities: [
      {
        status: true,
        name: "Extra Legroom",
      },
      {
        status: true,
        name: "Semi Refundable",
      },
      {
        status: false,
        name: "Paid Food",
      },
      {
        status: false,
        name: "Non Exchangeable",
      },
    ],
  },
  {
    type: "business",
    name: "Business",
    price: {
      train: 500,
      flight: 1000,
      bus: 100,
    },
    facilities: [
      {
        status: true,
        name: "Extra Legroom",
      },
      {
        status: true,
        name: "Semi Refundable",
      },
      {
        status: true,
        name: "Free Food",
      },
      {
        status: true,
        name: "Full Exchangeable",
      },
    ],
  },
];
