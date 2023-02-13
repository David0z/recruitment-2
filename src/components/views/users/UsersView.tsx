import { useEffect, useState, useCallback, useContext } from "react";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import LoadingSpinner from "../../spinner/LoadingSpinner";
import UserItem from "./UserItem";
import { ToastContext, ToastContextProps } from "../../view/View";

type DeletionModalProps = {
  show: boolean;
  onHide: () => void;
  handleDeleteUser: () => void;
  deletionLoading: boolean;
};

const DeletionModal = ({
  onHide,
  show,
  handleDeleteUser,
  deletionLoading,
}: DeletionModalProps) => {
  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={onHide}
    >
      <Modal.Header closeButton className="bg-danger text-light">
        <Modal.Title id="contained-modal-title-vcenter">Warning!!!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Are you sure you want to delete this user?</h4>
        <p>This action cannot be undone!</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={handleDeleteUser}
          disabled={deletionLoading}
        >
          {deletionLoading ? (
            <div className="d-flex align-items-center gap-1">
              <Spinner size="sm" />
              <span>Deleting user...</span>
            </div>
          ) : (
            <span>Delete user</span>
          )}
        </Button>
        <Button onClick={onHide} variant="outline-dark">
          Chancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
};

const UsersView = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDeletionModal, setShowDeletionModal] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [deletionLoading, setDeletionLoading] = useState<boolean>(false);
  const { setShowToast, setToastMessage } = useContext(
    ToastContext
  ) as ToastContextProps;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data = await response.json();
      setLoading(false);
      setUsers(data);
      return;
    }

    fetchData();
  }, []);

  const hideDeletionModal = useCallback(() => {
    if (!deletionLoading) {
      setShowDeletionModal(false);
      setUserToDelete(null);
    }
  }, [deletionLoading]);

  const handleDeleteUser = useCallback(async () => {
    setDeletionLoading(true);
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userToDelete}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      setToastMessage(
        `User ${
          users.find((u) => u.id === userToDelete)?.username
        } removed successfully!`
      );
      setShowToast(true);
      hideDeletionModal();
      setUsers((prevState) =>
        prevState.filter((user) => user.id !== userToDelete)
      );
    }

    setDeletionLoading(false);
  }, [userToDelete, hideDeletionModal, setToastMessage, setShowToast, users]);

  return (
    <div className="mx-auto" style={{ width: "min(50rem, 90%)" }}>
      {loading && (
        <LoadingSpinner>
          <span className="lead fs-1">Loading users...</span>
        </LoadingSpinner>
      )}
      {!loading &&
        (users.length > 0 ? (
          <div className="my-5 d-grid gap-5">
            {users.map((user) => (
              <UserItem
                user={user}
                key={user.id}
                setUserToDelete={setUserToDelete}
                setShowDeletionModal={setShowDeletionModal}
              />
            ))}
          </div>
        ) : (
          <p className="text-center display-6">No users to show :/</p>
        ))}
      <DeletionModal
        onHide={() => hideDeletionModal()}
        show={showDeletionModal}
        handleDeleteUser={handleDeleteUser}
        deletionLoading={deletionLoading}
      />
    </div>
  );
};

export default UsersView;
