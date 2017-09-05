$result = Invoke-Command -Computername QA_PowerUltra -Credential QA_PowerUltra\Administrator -Scriptblock {quser}
if ($result -match "Active")
{
    $true
}
else
{
    $false
}