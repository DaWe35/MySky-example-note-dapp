
import { SkynetClient } from "skynet-js"
import { ContentRecordDAC } from "@skynetlabs/content-record-library";


let isLoggedIn = false
let mySky
let userId

const hostApp = "sky-note.hns"
const client = new SkynetClient("https://siasky.net/")

async function login() {
	if (!isLoggedIn) {
		isLoggedIn = await mySky.requestLoginAccess()
	}
	checkLogin()
}

// Assume we have a logged-in mysky instance from above
async function getJSON() {
	try {
		// Get discoverable JSON data from the given path.
		const { data, skylink } = await mySky.getJSON("app.hns/path/file.json");
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
		const { data, skylink } = await mySky.setJSON("app.hns/path/file.json", { message: ''+message+'' })
		return data
	} catch (error) {
	  	console.log(error)
		  return false
	}
}

async function checkLogin() {
	isLoggedIn = await mySky.checkLogin();

	if (isLoggedIn) {
		await loadData()
		userId = await mySky.userID()
		$(".hide-if-logged-in").hide()
		$(".show-if-logged-in").show()
	} else {
		userId = null
		$(".hide-if-logged-in").show()
		$(".show-if-logged-in").hide()
	}
}

async function loadData() {
	let dacfile = await getJSON()
	if (dacfile != null) {
		$("#note").val(dacfile.message)
	} else {
		$("#note").val('')
		alert('failed to load')
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
		} else {
			alert('save failed')
		}
	})
});

$("#logout").click(function() {
	logout()
});

$("#login-button").click(function() {
	login()
});


// define async setup function
async function initMySky() {
	try {
		// load invisible iframe and define app's data domain
		// needed for permissions write
		mySky = await client.loadMySky(hostApp, {
			debug: false,
			dev: true,
		});
  
		// load necessary DACs and permissions
		// await mySky.loadDacs(contentRecord);
		const dac = new ContentRecordDAC()
		let dacData = await mySky.loadDacs(dac)
		console.log('dacData', dacData)
	
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

})();

