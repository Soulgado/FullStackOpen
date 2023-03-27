const Persons = ({ personsToShow, handleClick }) => {
    return (
        <div>
            {personsToShow().map(person =>
                <div key={person.name}>
                    {person.name} {person.number}
                    <button type="button" onClick={handleClick(person.id)}>Delete</button>
                </div>)}
        </div>
    );
}

export default Persons;