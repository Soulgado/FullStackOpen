import { useEffect, useState } from "react";
import axios from "axios";

import Countries from "./Components/Countries";

function App() {
  const [filter, setFilter] = useState("");
  const [countries, setCountries] = useState(null);
  

  const handleFilterChange = (event) => {
    event.preventDefault();
    setFilter(event.target.value);
  }

  const handleShowClick = (countryName) => () => {
    setCountries(countries.filter(country => country.name.common === countryName));
  }

  useEffect(() => {
    if (filter !== "") {
      axios.get("https://restcountries.com/v3.1/all")
        .then(response => {
          const filteredCountries = response.data.filter(country => 
            country.name.common.toLowerCase().includes(filter.toLowerCase()));
          setCountries(filteredCountries);
        }); 
    }
    
  }, [filter]);
  
  return (
    <div>
      find countries
      <input type="text" value={filter} onChange={handleFilterChange}/>
      <Countries countries={countries} handleShowClick={handleShowClick}/>
    </div>
  );
}

export default App;
