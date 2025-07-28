import { useLocation, Link } from "react-router-dom";

function QuoteResult() {
  const { state } = useLocation();
  const { origin, destination, containerId, containerType, quote } =
    state || {};

  console.log("containerId:", containerId);
  console.log("quote.rates:", quote?.rates);

  const rate = quote?.rates.find((r) => r.containerId === Number(containerId));

  return (
    <>
      <div>
        <h1>Quote Result</h1>
        {quote && rate ? (
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
              <tr>
                <td>{origin}</td>
                <td>{destination}</td>
                <td>{containerType}</td>
                <td>{rate.freight}</td>
                <td>{rate.thc}</td>
                <td>{rate.doc}</td>
                <td>{rate.dhc}</td>
                <td>{rate.lss}</td>
                <td>{quote.transitTime}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>No quote found.</p>
        )}
      </div>
      <Link
        to="/booking"
        state={{ origin, destination, containerId, containerType, quote }}
      >
        Book Now
      </Link>
    </>
  );
}

export default QuoteResult;
