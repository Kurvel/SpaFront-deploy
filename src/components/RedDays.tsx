import { useEffect } from "react";

function GetRedDays() {
  useEffect(() => {
    fetch("http://sholiday.faboul.se/dagar/v2.1/2024")
      .then((response) => response.json())
      .then((data) => {
        const holiday = data.dagar.filter((dag: any) => dag.helgdag);
        console.log(holiday);
      });
  }, []);

  return (
    <div>
      <h3>RedDays</h3>
    </div>
  );
}

export default GetRedDays;
