import Spinner from "react-bootstrap/Spinner";
import { ReactNode } from "react";

type LoadingSpinnerProps = {
  children: ReactNode;
};

const LoadingSpinner = ({ children }: LoadingSpinnerProps) => {
  return (
    <div className="d-flex justify-content-center align-items-center gap-2 py-5">
      <Spinner />
      {children}
    </div>
  );
};

export default LoadingSpinner;
