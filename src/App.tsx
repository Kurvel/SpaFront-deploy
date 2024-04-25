import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Start from "./components/Start";
import About from "./components/About";
import Booking from "./components/Booking";
import Contacts from "./components/Contacts";
import Admin from "./components/Admin";

function App() {
  const [page, setPage] = useState<string>("");

  useEffect(() => {
    let pageUrl = page;

    if (!pageUrl) {
      const queryParameters = new URLSearchParams(window.location.search);
      const getUrl = queryParameters.get("page");

      if (getUrl) {
        pageUrl = getUrl;
        setPage(getUrl);
      } else {
        pageUrl = "start";
      }
    }
    window.history.pushState(null, "", "?page=" + pageUrl);
  }, [page]);

  return (
    <>
      <Header setPage={setPage} />

      {{
        start: <Start />,
        about: <About />,
        contacts: <Contacts />,
        booking: <Booking />,
        admin: <Admin />,
      }[page] || <Start />}
    </>
  );
}

export default App;
