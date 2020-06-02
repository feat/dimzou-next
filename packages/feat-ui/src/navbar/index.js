import createTemplate from "../util/createTemplate";
import Navbar from "./Navbar";

Navbar.Brand = createTemplate({
  Compo: "div",
  baseName: "Navbar__brand",
  displayName: "Navbar.Brand",
});

Navbar.Left = createTemplate({
  Compo: "div",
  baseName: "Navbar__left",
  displayName: "Navbar.Left",
});

Navbar.Center = createTemplate({
  Compo: "div",
  baseName: "Navbar__center",
  displayName: "Navbar.Center",
});

Navbar.Right = createTemplate({
  Compo: "div",
  baseName: "Navbar__right",
  displayName: "Navbar.Right",
});

export default Navbar;
