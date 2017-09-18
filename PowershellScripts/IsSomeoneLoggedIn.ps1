Param(
  [string]$computer,
  [string]$password
)

$userName = "Administrator"
$securePassword = ConvertTo-SecureString $password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential -ArgumentList $userName, $securePassword

$result = Invoke-Command -Computername $computer -Credential $credential -Scriptblock {quser}

if ([string]::IsNullOrEmpty($Error[0]))
{
    if ($result -match "Active")
    {
        $true
    }
    else
    {
        $false
    }
}
else
{
    "Error"
}