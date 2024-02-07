import { useMutation } from "@apollo/client";
import { useState } from "react";
import { ALL_AUTHORS, EDIT_BIRTHYEAR } from "../queries";

const SetBirthYear = () => {
    const [name, setName] = useState("");
    const [born, setBorn] = useState("");

    const [ editBirthYear ] = useMutation(EDIT_BIRTHYEAR, {
        refetchQueries: [ { query: ALL_AUTHORS }]
    });

    const submit = async (event) => {
        event.preventDefault();

        editBirthYear({ variables: {
            name,
            born: parseInt(born)
        }});

        setName("");
        setBorn("");
    }

    return (
        <>
            <h2>Set Birthyear</h2>
            <form onSubmit={submit}>
                <div>
                    name
                    <input
                        value={name}
                        onChange={({ target }) => setName(target.value)}
                    />
                </div>
                <div>
                    born
                    <input 
                        type="number"
                        value={born}
                        onChange={({ target }) => setBorn(target.value)}
                    />
                </div>
                <button type="submit">Update author</button>
            </form>
        </>
    );
}

export default SetBirthYear;