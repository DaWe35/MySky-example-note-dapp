
import { SkynetClient } from "skynet-js"


let isLoggedIn = false
let mySky
let userId

const hostApp = "23672318746.hns"
const client = new SkynetClient("https://siasky.net/")

async function loginButton() {
	if (!isLoggedIn) {
		isLoggedIn = await mySky.requestLoginAccess()
	}
	await checkLogin()
	await changeUI()
}

// Assume we have a logged-in mysky instance from above
async function getJSON() {
	try {
		// Get discoverable JSON data from the given path.
		const { data, skylink } = await mySky.getJSON(hostApp + "/note.json");
		return data
	} catch (error) {
		console.log(error)
		return null
	}
}

async function setJSON(message) {
	try {
		console.log(message)
		// Set discoverable JSON data at the given path. The return type is the same as getJSON.
		const { data, skylink } = await mySky.setJSON(hostApp + "/note.json", { message: ''+message+'' })
		return data
	} catch (error) {
	  	console.log(error)
	  	alert('Error: ' + error.message)
		return false
	}
}

async function checkLogin() {
	isLoggedIn = await mySky.checkLogin();

	if (isLoggedIn) {
		userId = await mySky.userID()
	} else {
		userId = null
	}
}

async function changeUI() {
	if (isLoggedIn) {
		await loadData()
		$(".hide-if-logged-in").hide()
		$(".show-if-logged-in").show()
	} else {
		userId = null
		$(".hide-if-logged-in").show()
		$(".show-if-logged-in").hide()
	}
}

async function loadData() {
	let dataFile = await getJSON()
	if (dataFile != null) {
		$("#note").val(dataFile.message)
	} else {
		$("#note").val('')
	}
}

async function logout() {
	await mySky.logout()

	isLoggedIn = false
	userId = null

	$(".show-if-logged-in").hide()
	$(".hide-if-logged-in").show()
}



$("#save_note").click(function() {
	$(".no-send").hide()
	$(".sending").show()
	let message = $("#note").val()
	setJSON(message).then(function(data){
		if (data) {
			$(".no-send").show()
			$(".sending").hide()
		}
	})
});

$("#logout").click(function() {
	logout()
});

$("#login-button").click(function() {
	loginButton()
});


// define async setup function
async function initMySky() {
	try {
		// load invisible iframe and define app's data domain
		// needed for permissions write
		mySky = await client.loadMySky(hostApp, {
			debug: false,
			dev: false,
		});
  
		// load necessary DACs and permissions
		// await mySky.loadDacs(contentRecord);
	
		// check if user is already logged in with permissions
	} catch (e) {
		console.error(e);
	}
}
  

  

(async () => {

	// call async setup function
	await initMySky()
	$(".hide-if-initialized").hide()
	$(".show-if-initialized").show()
	await checkLogin()
	await changeUI()

})();

