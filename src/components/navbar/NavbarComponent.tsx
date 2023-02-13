import styles from "./NavbarComponent.module.scss";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Icon } from "@iconify/react";
import { ReactNode } from "react";
import { Views } from "../../App";

type NavViewProps = {
  children: ReactNode;
  onClick: () => void;
  view: Views;
  currentView: Views;
};

const NavView = ({ children, onClick, view, currentView }: NavViewProps) => {
  return (
    <Nav.Link
      as="div"
      data-view
      onClick={onClick}
      className={view === currentView ? "active text-decoration-underline" : ""}
    >
      {children}
    </Nav.Link>
  );
};

type NavbarComponentProps = {
  setView: (view: Views) => void;
  currentView: Views;
};

const NavbarComponent = ({ setView, currentView }: NavbarComponentProps) => {
  return (
    <Navbar bg="primary" variant="dark" className={styles.wrapper}>
      <Container>
        <Navbar.Brand as="div" className="d-flex align-items-center gap-1">
          <Icon icon="bi:house-fill" className="fs-2" />
          <span className="d-none d-md-block">Social Platform</span>
        </Navbar.Brand>
        <Nav className="me-auto">
          <NavView
            currentView={currentView}
            view={Views.USERS}
            onClick={() => setView(Views.USERS)}
          >
            Users
          </NavView>
          <NavView
            currentView={currentView}
            view={Views.POSTS}
            onClick={() => setView(Views.POSTS)}
          >
            Posts
          </NavView>
          <NavView
            currentView={currentView}
            view={Views.PICTURES}
            onClick={() => setView(Views.PICTURES)}
          >
            Pictures
          </NavView>
        </Nav>
        <Nav>
          <NavView
            currentView={currentView}
            view={Views.SETTINGS}
            onClick={() => setView(Views.SETTINGS)}
          >
            <Icon icon="bi:person-fill-add" className="fs-1" />
          </NavView>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
