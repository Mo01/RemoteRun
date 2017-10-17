
title.innerHTML += " " + oHTA.version + "." + VERSION;

window.resizeTo(1440 - 160, 790);

// Populate dropdown of tests.
for (var i = 0; i < tests.length; i++) {
    var testsDropdown = document.getElementById("tests-dropdown");
    testsDropdown.options.add(new Option(tests[i][0]));
    testsDropdown.options[testsDropdown.options.length - 1].innerHTML = tests[i][0];
    
    if (tests[i][1] == undefined) {
        testsDropdown.options[testsDropdown.options.length - 1].disabled = "disabled";
    } else {
        testsDropdown.options[testsDropdown.options.length - 1].value = tests[i][1];
    }
}

// Populate table of machines.
for (var i = 0; i < remoteMachines.length; i++) {
	var row = tableBody.insertRow(-1);
	for (var key in remoteMachines[i].htmlProperties) {
		var cell = row.insertCell(-1); 
		cell.innerHTML = remoteMachines[i].htmlProperties[key];
		if (key == "btnRun") {
			cell.align = "center";
		}
	}

	if (!canPingMachine(remoteMachines[i].ip)) {
		setMachineStatus(i, "Unable to ping");
	}
    
    $('#btnRun' + i)
        .click(function(event) {
            var id = $(this).attr('id').replace('btnRun', '');
            checkMachineStatus(id);
        })
        .click(function(event) {
            var id = $(this).attr('id').replace('btnRun', '');
            var status = getMachineStatus(id);
            if (status == '' || status == undefined) {
                alert('run test');
            }
        });
}
