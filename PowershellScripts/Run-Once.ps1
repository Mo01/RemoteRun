# Run this once before using Roctopus for the first time.

Set-ExecutionPolicy Unrestricted
Set-Item WSMan:\localhost\Client\TrustedHosts -Value '*'
Enable-PSRemoting -Force