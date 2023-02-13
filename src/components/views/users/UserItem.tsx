import { User } from "./UsersView";
import { Icon } from "@iconify/react";
import Button from "react-bootstrap/Button";
import { useCallback, useState, useContext } from "react";
import LoadingSpinner from "../../spinner/LoadingSpinner";
import { Views, ViewsContext, ViewsContextProps } from '../../../App'

type UserItemProps = {
  user: User;
  setShowDeletionModal: (bool: boolean) => void
  setUserToDelete: (user: number) => void
};

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const UserItem = ({ user, setShowDeletionModal, setUserToDelete }: UserItemProps) => {
  const [userPosts, setUserPosts] = useState<Post[] | null>(null);
  const [postsLoading, setPostsLoading] = useState<boolean>(false);
  const { setView, setUserToEdit } = useContext(ViewsContext) as ViewsContextProps;

  const getUserPosts = useCallback(async () => {
    if (!userPosts && !postsLoading) {
      setPostsLoading(true);
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${user.id}`
      );
      const data = await res.json();
      setUserPosts(data);
      setPostsLoading(false);
    }
  }, [userPosts, postsLoading, user.id]);

  const firstToUpper = (text: string) => {
    const firstHar = text[0].toUpperCase();
    const rest = text.slice(1, text.length);

    return firstHar.concat(rest)
  }

  const setEdit = () => {
    setUserToEdit(user)
    setView(Views.EDIT)
  }

  return (
    <div className="bg-secondary border border-2 border-primary rounded fs-5 shadow-lg">
      <address className="p-3">
        <div className="d-flex flex-column flex-md-row gap-3">
          <Icon icon="bi:person-square" style={{ fontSize: "160px" }} className="align-self-center"/>
          <div>
            <div className="fs-2">
              <span className="user-select-none">@</span>
              <span>{user.username}</span>
            </div>
            <div>
              <span className="user-select-none">Name: </span>
              <span>{user.name}</span>
            </div>

            <div>
              <span className="user-select-none">Email: </span>
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </div>
            <div>
              <span className="user-select-none">Phone: </span>
              <a href={`tel:${user.phone}`}>{user.phone}</a>
            </div>
            <div>
              <span className="user-select-none">Website: </span>
              <a
                href={`http://www.${user.website}`}
                target="_blank"
                rel="noreferrer"
              >
                {user.website}
              </a>
            </div>
          </div>
          <div className="d-flex align-self-stretch flex-column flex-sm-row gap-2 ms-sm-auto justify-content-end align-self-md-start">
            <Button className="d-flex align-items-center justify-content-center" onClick={setEdit}>
              <Icon icon="bi:pencil-square"/>
              <span className="ms-1 d-md-none">Edit user</span>
            </Button>
            <Button className="d-flex align-items-center justify-content-center" variant="danger" onClick={() => {
              setShowDeletionModal(true)
              setUserToDelete(user.id)
            }}>&#10005;
              <span className="ms-1 d-md-none">Delete user</span>
            </Button>
          </div>
        </div>
        <hr />
        <div>
          <div>
            <span className="user-select-none">Adress: </span>
            <span>
              {user.address.street}, {user.address.suite}, {user.address.city}
            </span>
          </div>
          <div>
            <span className="user-select-none">Postal code: </span>
            <span>{user.address.zipcode}</span>
          </div>
        </div>
      </address>
      <div className="bg-primary">
        <div className="text-light p-3">
          <p className="display-5">{user.company.name}</p>
          <p className="lead fst-italic">"{user.company.catchPhrase}"</p>
          <div className="d-flex flex-wrap gap-2">
            {user.company.bs.split(" ").map((tag) => (
              <span className="btn btn-light fs-6 p-0 px-1" key={tag}>#{tag}</span>
            ))}
          </div>
        </div>
        <Button
          disabled={postsLoading || userPosts != null}
          onClick={getUserPosts}
          variant="primary"
          className="d-flex justify-content-center align-items-center w-100"
        >
          <Icon icon="bi:arrow-down" />
          <span>View user's post</span>
          <Icon icon="bi:arrow-down" />
        </Button>
      </div>
      {postsLoading && <LoadingSpinner>Loading user's posts</LoadingSpinner>}
      {userPosts && (
        <div className="p-3">
          {userPosts.map((post, index, arr) => (
            <div key={post.id}>
              <p className="fs-4 text-decoration-underline">{firstToUpper(post.title)}</p>
              <p className="fs-6">{firstToUpper(post.body)}</p>
              {arr[index + 1] && <hr />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserItem;
