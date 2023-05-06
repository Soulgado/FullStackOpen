import { Alert } from "react-bootstrap";

const Notification = ({ info }) => {
  if (!info.message) return;

  return (
    <Alert
      variant={`${info.type === "danger" ? "danger" : "success"}`}
      id="notification"
    >
      {info.message}
    </Alert>
  );
};

export default Notification;
