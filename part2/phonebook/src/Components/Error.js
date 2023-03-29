const ErrorMessage = ({ message }) => {
    if (message === null) return null;

    return (
        <div className="message error">
            {message}
        </div>
    )
}

export default ErrorMessage;