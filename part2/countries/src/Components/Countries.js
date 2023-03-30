const Countries = ({ countries }) => {
    if (!countries) return null;

    if (countries.length > 10) return <div>Too many matches, specify another filter</div>;

    if (countries.length < 10 && countries.length > 1) {
        return (
            <ul>
                {countries.map(country => <div key={country.name.common}>{country.name.common}</div>)}
            </ul>
        );
    }

    if (countries.length === 1) {
        return (
            <div>
                <h2>{countries[0].name.common}</h2>
                <div>Capital: {countries[0].capital}</div>
                <div>Area: {countries[0].area} sq. km.</div>
                <div>
                    <strong>Languages:</strong>
                    <ul>
                        {Object.values(countries[0].languages)
                            .map(language => <li key={language}>{language}</li>)}
                    </ul>
                </div>
                <img src={countries[0].flags.png} alt={countries[0].flags.alt} />
            </div>
        );
    }
}

export default Countries;