//
//  Chromecaster.swift
//  EightiesBlaster
//
//  Created by Mark Percival on 3/10/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

import Foundation


@objc(Chromecaster)
class Chromecaster: NSObject, GCKDeviceScannerListener, GCKDeviceManagerDelegate, GCKMediaControlChannelDelegate {
  
  var bridge          : RCTBridge!
  
  private let kReceiverAppID = "8DFFC50C"
  private var deviceManager: GCKDeviceManager?
  private var deviceScanner: GCKDeviceScanner?
  private var devices: Dictionary<String, GCKDevice> = Dictionary<String, GCKDevice>()
  private var isInitialized = false
  
  @objc func startScan() -> Void {
    dispatch_async(dispatch_get_main_queue(), { [unowned self] in
      if (!self.isInitialized) {
        print("Initializing")
        let filterCriteria = GCKFilterCriteria(forAvailableApplicationWithID:
          self.kReceiverAppID)
        self.deviceScanner = GCKDeviceScanner(filterCriteria:filterCriteria)
        self.deviceScanner?.addListener(self)
        print("startScan")
        self.deviceScanner?.startScan()
        self.isInitialized = true
      }
      })
  }
  
  @objc func connectToDevice(deviceName: String) -> Void {
    let selectedDevice = self.devices[deviceName]
    if (selectedDevice == nil) {
      return
    }
    
    dispatch_async(dispatch_get_main_queue(), { [unowned self] in
      let identifier = NSBundle.mainBundle().infoDictionary?["CFBundleIdentifier"] as! String
      self.deviceManager = GCKDeviceManager(device: selectedDevice, clientPackageName: identifier)
      self.deviceManager!.delegate = self
      self.deviceManager!.connect()
      })
  }
  
  @objc func disconnect() -> Void {
    if (self.deviceManager == nil) {
      return
    }
    dispatch_async(dispatch_get_main_queue(), { [unowned self] in
      // Disconnect button.
      self.deviceManager!.leaveApplication()
      self.deviceManager!.disconnect()
      })
  }
  
  func deviceManagerDidConnect(deviceManager: GCKDeviceManager!) {
    print("Connected.")
    dispatch_async(dispatch_get_main_queue(), { [unowned self] in
      self.deviceManager!.launchApplication(self.kReceiverAppID)
      })
  }
  
  func deviceManager(deviceManager: GCKDeviceManager!,
    didConnectToCastApplication
    applicationMetadata: GCKApplicationMetadata!,
    sessionID: String!,
    launchedApplication: Bool) {
      print("Application has launched.")
  }
  
  func deviceDidComeOnline(device: GCKDevice!) {
    devices[device.friendlyName] = device;
    print("Device found: \(device.friendlyName)")
    emitDeviceListChanged()
}
  
  func deviceDidGoOffline(device: GCKDevice!) {
    print("Device went away: \(device.friendlyName)")
    devices.removeValueForKey(device.friendlyName);
    emitDeviceListChanged()
  }
  
  private func emitDeviceListChanged() {
    let deviceKeys = devices.keys.elements.flatMap({$0})
    bridge.eventDispatcher.sendAppEventWithName("DeviceListChanged", body: ["devices": deviceKeys])
    print("Emit Devices: \(deviceKeys)")
  }
  
}