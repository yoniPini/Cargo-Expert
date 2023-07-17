import { useState, createContext, useContext } from "react";

export const EditContext = createContext(null);

export const EditProvider = ({ children }) => {
	const [edit, setEdit] = useState(false);

	return (
		<EditContext.Provider value={{ edit, setEdit }}>
			{children}
		</EditContext.Provider>
	);
};

export const useEdit = () => useContext(EditContext);
