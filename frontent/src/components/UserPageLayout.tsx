import type { ReactNode } from "react";
import RouteNotice from "./RouteNotice";
import UserNavbar from "./UserNavbar";

type UserPageLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  background?: ReactNode;
};

const UserPageLayout = ({ title, description, children, background }: UserPageLayoutProps) => (
  <div className="user-portal">
    <UserNavbar />
    <main className="user-main">
      {background && <div className="user-page-background" aria-hidden="true">{background}</div>}
      <RouteNotice />
      <header className="user-page-heading">
        <p>ACCOUNT</p>
        <h1>{title}</h1>
        <span>{description}</span>
      </header>
      {children}
    </main>
  </div>
);

export default UserPageLayout;
