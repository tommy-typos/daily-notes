import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import { isToday, debounce, saveToDB } from "../utils";

const formatOptions = { year: "numeric", month: "long", day: "numeric" };

export default function Home() {
	const timeoutRef = useRef(null);
	const inputElement = useRef();

	const [selectedDate, setSelectedDate] = useState(new Date());
	const [text, setText] = useState("");
	const [active_start_date, setActiveStartDate] = useState(new Date());

	const changeActiveStartDate = ({ action, activeStartDate, value, view }) => {
		setActiveStartDate(activeStartDate);
	};

	const focusInput = () => {
		inputElement.current.focus();
	};

	useEffect(() => {
		const dateFormatted = selectedDate.toLocaleDateString("en-US");
		const userData = JSON.parse(window.localStorage.getItem("userData")) || {};

		if (userData[dateFormatted]) {
			setText(userData[dateFormatted]);
			inputElement.current.parentNode.dataset.replicatedValue = userData[dateFormatted];
		} else {
			setText("");
			inputElement.current.parentNode.dataset.replicatedValue = "";
		}

		focusInput();
	}, [selectedDate]);

	const goToToday = () => {
		setSelectedDate(new Date());
		setActiveStartDate(new Date());
	};

	function inputChangeHandler(e) {
		setText(e.target.value);
		debounce(
			(inputValue) => {
				saveToDB(inputValue, selectedDate);
			},
			undefined,
			timeoutRef
		)(e.target.value);
		inputElement.current.parentNode.dataset.replicatedValue = e.target.value;
	}

	return (
		<>
			<Head>
				<title>Daily Notes</title>
				<meta name="description" content="Daily Note Taking App" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" sizes="any" />
			</Head>
			<div className="App">
				<div className="sidebar">
					<Calendar
						value={selectedDate}
						onChange={setSelectedDate}
						onActiveStartDateChange={changeActiveStartDate}
						activeStartDate={active_start_date}
					/>
					<button className="setToday" onClick={goToToday}>
						Go to Today
					</button>
				</div>
				<div className="main">
					<h1 className={isToday(selectedDate) ? "h1today" : ""}>
						{selectedDate.toLocaleDateString("en-US", formatOptions)}
						{isToday(selectedDate) ? " (Today)" : ""}
					</h1>
					<div className="grow-wrap">
						<textarea
							ref={inputElement}
							type="text"
							className="textArea"
							value={text}
							onChange={(e) => inputChangeHandler(e)}
							placeholder="Start writing"
						/>
					</div>
				</div>
			</div>
		</>
	);
}
