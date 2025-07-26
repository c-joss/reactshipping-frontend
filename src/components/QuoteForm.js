import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function QuoteForm() {
  const [portPairs, setPortPairs] = useState([]);
  const [containers, setContainers] = useState([]);

  useEffect(() => {
    fetch(`${ProcessingInstruction.env.REACT_APP_API_URL}/containers`)
      .then((res) => res.json())
      .then(setContainers);
  }, []);

  return <h1>Quote Form</h1>;
}

export default QuoteForm;
