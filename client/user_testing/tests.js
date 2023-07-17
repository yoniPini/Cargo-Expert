const testRegister = async () => {
	const user = await createNewUser(email, password);
	const dbUser = await getUser(email);
	if (user.email != dbUser.email || user.password != dbUser.password) {
		console.log(`Error: user email or password mismatch`);
	}
};

const testLogin = async () => {
	const user = await createNewUser(email, password);
	const result = await login(user);
	if (result.status === "false") {
		console.log(`Error: ${result.message}}`);
	}
};

const testChangeProjectName = async () => {
	let demoProject = await createNewProject("demo", []);
	changeName(demoProject, "not_demo");
	if (demoProject.name != "not_demo") {
		console.log(`Error: name mismatch}`);
	}
};

const testRemoveItem = async (items, item) => {
	let before_length = items.length;
	items.removeItem(item);
	if (items.length != before_length - 1 || items.includes(item)) {
		console.log(`Error: sonmething wrong}`);
	}
};

const testAddItem = async (items, item) => {
	let before_length = items.length;
	items.addItem(item);
	if (items.length != before_length + 1 || !items.includes(item)) {
		console.log(`Error: sonmething wrong}`);
	}
};
