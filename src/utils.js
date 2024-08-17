export const isToday = (someDate) => {
	const today = new Date();
	return (
		someDate.getDate() === today.getDate() &&
		someDate.getMonth() === today.getMonth() &&
		someDate.getFullYear() === today.getFullYear()
	);
};

export const debounce = (cb, delay = 150, timeoutRef) => {
	return (...args) => {
		clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			cb(...args);
		}, delay);
	};
};

export const saveToDB = (inputValue, selectedDate) => {
	const userData = JSON.parse(window.localStorage.getItem("userData")) || {};
	const dateFormatted = selectedDate.toLocaleDateString("en-US");
	userData[dateFormatted] = inputValue;
	window.localStorage.setItem("userData", JSON.stringify(userData));
};
