/* @refresh reload */
import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";
import { Layout } from "./components/layout";
import { HeroDetailPage } from "./pages/detail-page";
import { HeroLandingPage } from "./pages/landing-page";
import "./index.css";

const root = document.getElementById("root");

render(
  () => (
    <Router root={Layout}>
      <Route path="/" component={HeroLandingPage} />
      <Route path="/:slug" component={HeroDetailPage} />
    </Router>
  ),
  root!,
);
