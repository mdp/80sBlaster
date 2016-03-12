//
//  ChromecasterBridge.m
//  EightiesBlaster
//
//  Created by Mark Percival on 3/10/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

// ChromecasterBridge.m
#import "RCTEventDispatcher.h"
#import "RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(Chromecaster, NSObject)

RCT_EXTERN_METHOD(startScan)

RCT_EXTERN_METHOD(connectToDevice: (NSString *) deviceName)

RCT_EXTERN_METHOD(disconnect)

@end