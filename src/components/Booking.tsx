import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ChoiceVarmCold from "./ChoiceVarmCold";
import { Option } from "./ChoiceVarmCold";
import Time from "./Time";
import { TimeOption } from "./Time";
import FetchOptionsComponent, { FetchOptions } from "./FetchOptions";
import "./Booking.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const options: Option[] = [
  { label: "Warm" },
  { label: "Cold" },
  { label: "Warm or Cold?" },
];

const timeOptions: TimeOption[] = [
  { label: "Am" },
  { label: "Fm" },
  { label: "Evening" },
  { label: "Am, Fm or Evning?" },
];

function Booking() {
  const [newDate, setNewDate] = useState<Value>(new Date());
  const [newName, setNewName] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimeOption | null>(null);
  const [filteredData, setFilteredData] = useState<FetchOptions[]>([]);
  const [filteredTimeData, setFilteredTimeData] = useState<FetchOptions[]>([]);
  const [redDays, setRedDays] = useState<Date[]>([]);

  const handleSelectedOptionChange = (option: Option | null) => {
    console.log("Selected option changed:", option);
    setSelectedOption(option);
  };

  const processData = (
    data: FetchOptions[],
    setData: React.Dispatch<React.SetStateAction<FetchOptions[]>>
  ) => {
    console.log("Filtered Data:", data);
    setData(data);
  };

  useEffect(() => {
    processData(filteredData, setFilteredData);
  }, [filteredData]);

  useEffect(() => {
    processData(filteredTimeData, setFilteredTimeData);
  }, [filteredTimeData]);

  const saveDate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isoDate = (newDate as Date).toISOString();

    fetch("http://localhost:8080/date", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        date: isoDate,
        name: newName,
        option: selectedOption?.label || options[0].label,
        timeOption: selectedTime?.label || timeOptions[0].label,
      }),
    })
      .then(() => console.log("Date saved successfully", isoDate))
      .catch((error) => console.error("Error saving date:", error));

    setSelectedOption(
      options.find((option) => option.label === "Warm or Cold?") || null
    );
    setSelectedTime(null);
    setNewName("");
  };

  const isDateDisabled = (date: Date, filteredData: FetchOptions[]) => {
    return filteredData.some((item) => {
      const itemDate = new Date(item.date);
      return (
        date.getFullYear() === itemDate.getFullYear() &&
        date.getMonth() === itemDate.getMonth() &&
        date.getDate() === itemDate.getDate()
      );
    });
  };
  const isMonday = (checkDate: Date): boolean => {
    return checkDate.getDay() === 1;
  };

  useEffect(() => {
    fetch("http://sholiday.faboul.se/dagar/v2.1/2024")
      .then((response) => response.json())
      .then((data) => {
        const redDays = data.dagar
          .filter((dag: any) => dag.helgdag)
          .map((dag: any) => new Date(dag.datum));
        setRedDays(redDays);
      })
      .catch((error) => console.error("Error fetching red days:", error));
  }, []);

  return (
    <div>
      <h3>BOOKING</h3>
      <form onSubmit={saveDate}>
        <div className="choice">
          <ChoiceVarmCold
            options={options}
            setSelectedOption={(option) => handleSelectedOptionChange(option)}
            selectedOption={selectedOption}
          />
          <Time
            timeOptions={timeOptions}
            setSelectedTime={setSelectedTime}
            selectedTime={selectedTime}
          ></Time>
        </div>
        <label>Name: </label>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <div className="Booking">
          <Calendar
            tileDisabled={({ date }) =>
              isDateDisabled(date, filteredData) ||
              isMonday(date) ||
              redDays.some(
                (redDay) =>
                  date.getDate() === redDay.getDate() &&
                  date.getMonth() === redDay.getMonth() &&
                  date.getFullYear() === redDay.getFullYear()
              )
            }
            onChange={setNewDate}
            value={newDate}
          />
        </div>

        <div>
          <FetchOptionsComponent
            option={selectedOption ? selectedOption.label : options[0].label}
            timeOption={
              selectedTime ? selectedTime.label : timeOptions[0].label
            }
            setFilteredData={setFilteredData}
          />
        </div>
        <button type="submit" onClick={() => window.alert("Date booked!")}>
          Save
        </button>
      </form>
    </div>
  );
}

export default Booking;
