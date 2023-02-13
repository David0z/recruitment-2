import NavbarComponent from "./components/navbar/NavbarComponent";
import { useState, useCallback, createContext } from "react";
import View from "./components/view/View";
import PicturesView from "./components/views/pictures/PicturesView";
import PostsView from "./components/views/posts/PostsView";
import SettingsView from "./components/views/settings/SettingsView";
import UsersView from "./components/views/users/UsersView";
import { User } from "./components/views/users/UsersView";
import Footer from "./components/footer/Footer";

export enum Views {
  USERS,
  POSTS,
  PICTURES,
  SETTINGS,
  EDIT,
}
// Nie wiedziałem, czy można użyć Routera, więc nie skorzystałem. Użyłem tylko bibliotek,
// które zostały wymienione w opisie zadania. W CV mam projekt z routerem, więc spokojnie -
// wiem jak używać :)

export type ViewsContextProps = {
  setView: (view: Views) => void;
  userToEdit: User | null;
  setUserToEdit: (user: User) => void;
};

export const ViewsContext = createContext<ViewsContextProps | null>(null);

function App() {
  const [currentView, setCurrentView] = useState<Views>(Views.USERS);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const setView = useCallback((view: Views) => {
    setCurrentView(view);
  }, []);

  const renderViews = useCallback(
    (view: Views) => {
      switch (view) {
        case Views.PICTURES:
          return <PicturesView />;
        case Views.POSTS:
          return <PostsView />;
        case Views.SETTINGS:
          return <SettingsView />;
        case Views.EDIT:
          return <SettingsView isEditMode={true} userToEdit={userToEdit} />;
        case Views.USERS:
          return <UsersView />;
        default:
          return null;
      }
    },
    [userToEdit]
  );

  return (
    <>
      <NavbarComponent setView={setView} currentView={currentView} />
      <ViewsContext.Provider value={{ setView, userToEdit, setUserToEdit }}>
        <View>{renderViews(currentView)}</View>
      </ViewsContext.Provider>
      <Footer />
    </>
  );
}

export default App;
