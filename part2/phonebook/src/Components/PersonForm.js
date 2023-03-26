const PersonForm = (props) => {
    return (
        <form>
            <div>
                name: <input type="text" value={props.newName} onChange={props.handleNameChange} />
            </div>
            <div>
                number: <input type="text" value={props.newNumber} onChange={props.handleNumberChange} />
            </div>
            <div>
                <button type="submit" onClick={props.handleSubmit}>add</button>
            </div>
        </form>
    )
}

export default PersonForm;