import { useAppDatabase } from "@exploriana/hooks/use-database";
import { Booking } from "@exploriana/interface/core";
import { createFactory } from "@exploriana/lib/core";
import { useMutation } from "@tanstack/react-query";

export function useCreateBooking() {
  const [appDatabase] = useAppDatabase();

  return useMutation({
    mutationFn: async (booking: Booking) => {
      const { id, transport, name, placeOfDeparture, placeOfArrival, dateOfDeparture, dateOfArrival, dateOfReturn, transportNumber, seat, transportID, price, createdAt } = booking;
      return createFactory(Promise<Booking>, (resolve, reject) => {
        appDatabase!.transaction((sql) => {
          sql.executeSql(
            `CREATE TABLE IF NOT EXISTS bookings (
              id TEXT NOT NULL PRIMARY KEY, 
              transport TEXT, 
              name TEXT, 
              placeOfDeparture TEXT, 
              placeOfArrival TEXT, 
              dateOfDeparture TEXT, 
              dateOfArrival TEXT, 
              dateOfReturn TEXT,
              transportNumber TEXT, 
              seat TEXT, 
              transportID TEXT,  
              price INTEGER,
              createdAt TEXT
            );`,
            [],
            () => {
              console.log("Bookings table has been created");
            },
            (_, error) => {
              if (error) reject(error.message);
              return false;
            }
          );
        });
        appDatabase!.transaction((sql) => {
          sql.executeSql(
            `
            INSERT INTO bookings (id, transport, name, placeOfDeparture, placeOfArrival, dateOfDeparture, dateOfArrival, dateOfReturn, transportNumber, seat, transportID,  price, createdAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
          `,
            [id, transport, name, placeOfDeparture, placeOfArrival, dateOfDeparture, dateOfArrival, dateOfReturn, transportNumber, seat, transportID, price, createdAt],
            () => {
              console.log("Booking has been created");
              resolve(booking);
            },
            (_, error) => {
              if (error) reject(error.message);
              return false;
            }
          );
        });
      });
    },
  });
}
