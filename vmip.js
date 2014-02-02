var exec = require('child_process').exec;

function getVmIps(err, stdout, stderr, vmName) {
    var ipFlag = "IP, value: ";
    var ipPattern = "[\\d\\.]*";
    var regexp = new RegExp(ipFlag + ipPattern);
    var ips = stdout.match(regexp);

    if (ips) {
        for (var x = 0; x < ips.length; x++) {
            ips[x] = ips[x].replace(ipFlag, "");
        }

        var ipsMessage = ips.join("\n");
        console.log(vmName.replace(/"/g,''));
        console.log(ipsMessage + "\n");
    }
    else{
        console.log(vmName + " has no interfaces");
    }
};

exec("vboxmanage list runningvms", function (err, stdout, stderr) {
    var vmNames = stdout.match(/"([^"]*)"/g);
    if (vmNames) {
        for (var x = 0; x < vmNames.length; x++) {
            var vmName = vmNames[x];
            (function (vmName) {
                exec("VBoxManage guestproperty enumerate " + vmName, function (err, stdout, stderr) {
                    getVmIps(err, stdout, stderr, vmName)
                });
            })(vmName);
        }
    } else {
        console.log("No running VMs");
    }
});
