import { createContext, ReactNode, useState } from "react";
import Container from "react-bootstrap/Container";
import Toast from "react-bootstrap/Toast";

type ViewProps = {
  children: ReactNode;
};

export type ToastContextProps = {
  setShowToast: (bool: boolean) => void;
  setToastMessage: (message: string) => void;
};

export const ToastContext = createContext<ToastContextProps | null>(null);

const View = ({ children }: ViewProps) => {
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  return (
    <ToastContext.Provider value={{ setShowToast, setToastMessage }}>
      <Container className="flex-grow-1 d-grid align-items-center">
        {children}
        <div className="position-fixed top-0 end-0 m-5">
          <Toast
            autohide
            delay={3000}
            onClose={() => setShowToast(false)}
            show={showToast}
            className="d-inline-block m-1"
            bg="success"
          >
            <Toast.Header>
              <strong className="me-auto">Success</strong>
            </Toast.Header>
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>
        </div>
      </Container>
    </ToastContext.Provider>
  );
};

export default View;
