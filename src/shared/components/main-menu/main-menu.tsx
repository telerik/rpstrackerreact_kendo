import { Link } from "react-router-dom";
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
} from "@progress/kendo-react-layout";

export function MainMenu() {
  return (
    <AppBar
      themeColor={"dark"}
      positionMode={"fixed"}
      className={"flex-md-nowrap p-0 shadow"}
      style={{ zIndex: 1030 }}
    >
      <AppBarSection>
        <a className="navbar-brand col-sm-3 col-md-2 mr-0">
          <img src="/assets/img/rpslogo.png" className="logo" />
        </a>
      </AppBarSection>
      <AppBarSpacer />
      <AppBarSection>
        <nav className="my-2 my-md-0 mr-md-3">
          <Link className="p-2 text-light" to="/dashboard">
            Dashboard
          </Link>
          <Link className="p-2 text-light" to="/backlog">
            Backlog
          </Link>
        </nav>
      </AppBarSection>
    </AppBar>
  );
}
