import { Route, Router } from "@solidjs/router";
import { HeroDetailPage } from "./pages/HeroDetailPage";
import { HeroLandingPage } from "./pages/HeroLandingPage";

function App() {
  return (
    <Router>
      <Route path="/" component={HeroLandingPage} />
      <Route path="/:slug" component={HeroDetailPage} />
    </Router>
  );
}

export default App;
