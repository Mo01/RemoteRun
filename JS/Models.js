
		
		title.innerHTML += " " + oHTA.version;
		
		var filePath = document.location.href.replace("file:///", "");
        
        var tempFilePath = new ActiveXObject("Scripting.FileSystemObject").GetSpecialFolder(2) +
        				   "\\RoctopusConsoleRedirect.tmp";
		
		var architecture = {
			x64: "x64",
			x32: "x32"
		};

		var os = {
			v2008: "Server 2008",
			v2012: "Server 2012",
			v7: "7",
			v8: "8",
			v81: "8.1",
			v10: "10"
		};
		
		/* I MIGHT NOT NEED THESE
		var platforms = {
			desktop: "Desktop",
			android: "Android",
			iOs: "iOS"
		}
		
		var testProjectTypes = {
			acceptance: "Acceptance",
			performance: "Performance",
			regression: "Regression"
		}
		*/

		function RemoteMachine(sServerModel, sComputerName, sOS, sArchitecture, sIP) {
			RemoteMachine.Count++;

			this.index = RemoteMachine.Count;
			this.serverModel = sServerModel;
			this.computerName = sComputerName;
			this.username = "Administrator";
			this.os = sOS;
			this.architecture = sArchitecture;
			this.ip = sIP;

			var id = RemoteMachine.Count - 1;
			this.htmlProperties = {
				index: this.index,
				serverModel: this.serverModel,
				computerName: "<b>" + this.computerName + "</b>",
				os: this.os,
				architecture: this.architecture,
				ip: '<a href="javascript:remoteDesktop(' + id + ')" title="remote in">' + this.ip + '</a>',
				txtBoxPassword: '<input type="password" id="txtPassword' + id + '" class="form-control" onKeyUp="onTxtPasswordKeyUp(' + id + ')" />',
				status: '<span id="machineStatus' + id +'"></span>',
				btnRun: '<input type="button" class="btn btn-danger" value="Run Test" onClick="onRunTest(' + id + ')" align="middle" />'
			};
		}
		// Static property.
		RemoteMachine.Count = 0;
		
		var remoteMachines = [
			new RemoteMachine("PowerProR", "WIN-HOHNKC8JBI8", os.v2012, architecture.x64, "172.18.0.100"),
			new RemoteMachine("PowerPro", "QA-POWERPRO-RB", os.v7, architecture.x64, "172.18.0.101"),
			new RemoteMachine("PowerProR", "DESKTOP-HHC3INQ", os.v10, architecture.x64, "172.18.0.102"),
			new RemoteMachine("RM1100", "QA_RM1100", os.v81, architecture.x64, "172.18.0.103"),
			new RemoteMachine("RM1000R9_R10XMP", "QA-RM1000", os.v7, architecture.x32, "172.18.0.104"),
			new RemoteMachine("PowerUltra", "QA-Ultra720-120", os.v2008, architecture.x64, "172.18.0.120"),
			new RemoteMachine("PowerPlus", "QA-PowerPlus", os.v2008, architecture.x64, "172.18.0.121"),
			new RemoteMachine("PowerPlus", "WIN-V379E1QUSJ4", os.v2008, architecture.x64, "172.18.0.122"),
			new RemoteMachine("PowerPlus", "Win2012", os.v2012, architecture.x64, "172.18.0.123"),
			new RemoteMachine("PowerUltra", "QA-Ultra720-126", os.v2012, architecture.x64, "172.18.0.126"),
		];
