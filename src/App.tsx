import LandingPage from "./landing-page/LandingPage.tsx";
import { CookieConsentBanner } from "./landing-page/components/CookieConsentBanner";

function App() {
  return (
    <>
      <LandingPage />
      <CookieConsentBanner />{" "}
    </>
  );
}

export default App;
