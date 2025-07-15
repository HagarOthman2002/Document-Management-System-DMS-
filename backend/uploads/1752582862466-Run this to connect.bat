@echo off
title atos wifi
echo To Connect to The Wifi 
netsh wlan add profile filename= "./connect.XML"
netsh wlan connect name="ATOS_ACN"
netsh wlan add profile filename= "./connect2.XML"
netsh wlan connect name="ATOS_EG"
msg * "ATOS_ACN and ATOS_EG Netwrok configuration was added successfully"
del /F /q /a "connect.xml"
del /F /q /a "connect2.xml"