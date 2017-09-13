Param(
  [string]$computer,
  [string]$password
)

$secpasswd = ConvertTo-SecureString $password -AsPlainText -Force
$mycreds = New-Object System.Management.Automation.PSCredential ($computer + "\Administrator", $secpasswd)

$result = Invoke-Command -Computername QA_PowerUltra -Credential $mycreds -Scriptblock {quser}
if ($result -match "Active")
{
    $true
}
else
{
    $false
}