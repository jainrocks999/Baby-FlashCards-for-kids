//
//  Database.h
//  
//
//  Created by Hitesh on 10/05/09.
//  Copyright 2010. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <sqlite3.h>

@interface Database : NSObject {

}

+ (Database*) Connetion;
- (NSMutableDictionary *) getSettings;
- (NSInteger)saveSettings:(BOOL )ActualVoice Voice:(BOOL )Voice strRandomOrder:(BOOL )strRandomOrder Question:(BOOL)Question Swipe:(BOOL)Swipe English:(BOOL)English;

-(NSMutableArray*)GetAlliTems;

@end