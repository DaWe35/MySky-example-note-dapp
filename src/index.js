import { SkynetClient } from "skynet-js"
import { ContentRecordDAC } from "@skynetlabs/content-record-library";

let isLoggedIn = false
let mySky
let userId

const hostApp = "sky-note.hns"
const client = new SkynetClient("https://siasky.net/")


async function loadDacsExample() {
	try {
		// Initialize DAC, auto-adding permissions.
		const dac = new ContentRecordDAC()
		let data = await mySky.loadDacs(dac)
		return data
	} catch (error) {
	  	console.log(error)
	}
}



async function requestLoginAccessExample() {
	try {
		isLoggedIn = await mySky.checkLogin();
	
		// Add button action for login.
		if (!isLoggedIn) {
			document
			.getObjectByID("login-button")
			.addEventListener("click", mySky.requestLoginAccess());
		}
	} catch (error) {
	  	console.log(error)
	}
}

async function login() {
	isLoggedIn = await mySky.requestLoginAccess()

	if (isLoggedIn) {
		userId = await mySky.userID()
		loadDacsExample()
	}
}

async function logout() {
	await mySky.logout()

	isLoggedIn = false
	userId = null
}

// Assume we have a logged-in mysky instance from above

async function getJSONExample() {
	try {
	  // Get discoverable JSON data from the given path.
	  const { data, skylink } = await mySky.getJSON("app.hns/path/file.json");
	} catch (error) {
	  console.log(error)
	}
  }

async function setJSONExample() {
	try {
	  // Set discoverable JSON data at the given path. The return type is the same as getJSON.
	  const { data, skylink } = await mySky.setJSON("app.hns/path/file.json", { message: "hello" });
	} catch (error) {
	  console.log(error)
	}
}



(async () => {
	mySky = await client.loadMySky(hostApp, {
		debug: true,
		dev: true,
	})

	//await mySky.loadDacs(feedDAC)
	let asd = await loadDacsExample()
	console.log(asd)

	isLoggedIn = await mySky.checkLogin()

	if (isLoggedIn) {
		userId = await mySky.userID()
		loadDacsExample()
	}
})();