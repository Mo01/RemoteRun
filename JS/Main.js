
for (var i = 0; i < remoteMachines.length; i++) {
	var row = tableBody.insertRow(-1);
	for (var key in remoteMachines[i].htmlProperties) {
		var cell = row.insertCell(-1); 
		cell.innerHTML = remoteMachines[i].htmlProperties[key];
		if (key == "btnRun") {
			cell.align = "center";
		}
	}

	if (!pingMachine(remoteMachines[i].ip)) {
		setMachineStatus(i, "Unable to ping");
	}
}
