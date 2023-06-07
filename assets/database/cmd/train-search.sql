-- SQLite
SELECT id, name, placeOfDeparture, placeOfArrival
FROM trains WHERE trains.placeOfDeparture LIKE '%Howrah%';