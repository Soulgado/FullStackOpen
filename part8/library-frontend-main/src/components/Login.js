import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";

import { LOGIN } from "../queries";


const LoginForm = ({ show, setToken, setPage }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [login, result] = useMutation(LOGIN, {
        onError: (error) => {
            console.log(error);
        }
    });

    useEffect(() => {
        if (result.data) {
            const token = result.data.login.value;
            setToken(token);
            localStorage.setItem("library-app-user-token", token);
            setPage("books");    // change page to list of books
        }
    }, [result.data]);

    const submit = async (event) => {
        event.preventDefault();

        login({ variables: { username, password }});
    };

    if (!show) return null;

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    username <input
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password <input
                        type="password"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    );
};

export default LoginForm;
