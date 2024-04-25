import React, { useEffect, useState } from "react";

interface Date {
    id: string,
    date: string,
    name: string,
    option: string,
    timeOption: string
}

function Admin() {

    const [dates, setDates] = useState<Date[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        fetch("http://localhost:8080/dates")
        .then(res => res.json())
        .then(data => setDates(data));
    }, []);

    const deleteDate = (id: string) => {
        fetch("http://localhost:8080/date/" + id, {
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(res => console.log(res))
    }

    const fetchDateDetails = (id: string) => {
        setDates([]); // Clear the dates state
        
        fetch("http://localhost:8080/date/" + id)
        .then(res => res.json())
        .then(data => setSelectedDate(data));
    }

    const updateDate = () => {
        if (selectedDate) {
            fetch(`http://localhost:8080/date/${selectedDate.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedDate),
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                
                setSelectedDate(null);
                
                fetch("http://localhost:8080/dates")
            .then(res => res.json())
            .then(data => setDates(data));
               
            })
            .catch(error => console.error('Error:', error));
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (selectedDate) {
            setSelectedDate({
                ...selectedDate,
                [name]: value,
            });
        }
    }

    return(
        <div>
            <h3>Admin</h3>
            {dates.map((date: Date) => (
                <div key={date.id} >
                    <input type="checkbox" onClick={() => deleteDate(date.id)} />
                    <h3 onClick={() => fetchDateDetails(date.id)}>{date.name}</h3>
                    {date.date}
                </div>
            ))}
            {selectedDate && (
                <div>
                    <h3>Edit Date:</h3>
                    <p>ID: {selectedDate.id}</p>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={selectedDate.name}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Date:
                        <input
                            type="text"
                            name="date"
                            value={selectedDate.date}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Option:
                        <input
                            type="text"
                            name="option"
                            value={selectedDate.option}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Time Option:
                        <input
                            type="text"
                            name="timeOption"
                            value={selectedDate.timeOption}
                            onChange={handleInputChange}
                        />
                    </label>
                    <button onClick={updateDate}>Update Date</button>
                </div>
            )}
        </div>
    );
}

export default Admin;
