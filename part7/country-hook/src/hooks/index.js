import { useState, useEffect} from "react";
import axios from "axios";

export const useCountry = (countryName) => {
  const [country, setCountry] = useState({ found: false });

  useEffect(() => {
    axios.get(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
      .then(response => {
        let country = response.data[0];
        country.found = true;
        setCountry(country);
      })
      .catch(() => {
        setCountry({ found: false });
      });
  }, [countryName]);

  return country;
}