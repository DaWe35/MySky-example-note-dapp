
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
		mySky= await client.loadMySky(hostApp);
  
	  const loggedIn = await mySky.checkLogin();
  
	  // Add button action for login.
	  if (!loggedIn) {
		document.getElementById("login-button").addEventListener("click", function() {
			mySky.requestLoginAccess()
		  });
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

async function mySkyExample() {
	try {
	  // Initialize MySky.
	  mySky = await client.loadMySky(hostApp);
	} catch (error) {
	  console.log(error)
	}
  }



(async () => {
	mySky = await client.loadMySky(hostApp, {
		debug: true,
		dev: true,
	})
	let proba = await mySkyExample()
	let proba1 = await loadDacsExample().then(function(result){
		//document.getElementsByClassName("hide-if-initialized").style.display ="visible"
		$(".hide-if-initialized").hide()
		$(".show-if-initialized").show()
		
		})

	await requestLoginAccessExample()
	isLoggedIn = await mySky.checkLogin()
	console.log(isLoggedIn)

	if (isLoggedIn) {
		userId = await mySky.userID()
		loadDacsExample()
		$(".hide-if-logged-in").hide()
		$(".show-if-logged-in").show()
		
	}
})();

