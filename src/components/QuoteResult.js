import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function QuoteResult() {
  const { state } = useLocation();
  const {
    quotes = [],
    selectedContainerIds = [],
    selectedOrigin = [],
    selectedDestination = [],
  } = state || {};

  const [portPairs, setPortPairs] = useState([]);
  const [containers, setContainers] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/portPairs`)
      .then((res) => res.json())
      .then(setPortPairs);

    fetch(`${process.env.REACT_APP_API_URL}/containers`)
      .then((res) => res.json())
      .then(setContainers);
  }, []);

  const getPortPair = (id) => portPairs.find((pair) => pair.id === id) || {};
  const getContainerType = (id) =>
    containers.find((c) => c.id === id)?.type || id;

  console.log("Received quotes:", quotes);
  console.log("Selected container IDs:", selectedContainerIds);

  return (
    <div>
      <h1>Quote Result</h1>
      {quotes.length === 0 ? (
        <p>No rates found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Origin</th>
              <th>Destination</th>
              <th>Container</th>
              <th>Freight</th>
              <th>THC</th>
              <th>DOC</th>
              <th>DHC</th>
              <th>LSS</th>
              <th>Transit Time (days)</th>
            </tr>
          </thead>
          <tbody>
            {quotes.flatMap((quote, quoteIndex) => {
              const { load: origin, destination } = getPortPair(
                quote.portPairId
              );
              return quote.rates
                .filter(
                  (rate) =>
                    selectedOrigin.includes(origin) &&
                    selectedDestination.includes(destination) &&
                    selectedContainerIds.includes(rate.containerId)
                )
                .map((rate, rateIndex) => (
                  <tr key={`${quoteIndex}-${rateIndex}`}>
                    <td>{origin}</td>
                    <td>{destination}</td>
                    <td>{getContainerType(rate.containerId)}</td>
                    <td>${rate.freight || "N/A"}</td>
                    <td>${rate.thc || "N/A"}</td>
                    <td>${rate.doc || "N/A"}</td>
                    <td>${rate.dhc || "N/A"}</td>
                    <td>${rate.lss || "N/A"}</td>
                    <td>{quote.transitTime || "N/A"}</td>
                    <td>
                      <Link
                        to="/booking"
                        state={{
                          origin,
                          destination,
                          containerType: getContainerType(rate.containerId),
                          rate,
                          transitTime: quote.transitTime,
                        }}
                      >
                        Book Now
                      </Link>
                    </td>
                  </tr>
                ));
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default QuoteResult;
