//
//  Database.m
//  
//
//  Created by Hitesh on 10/05/10.
//  Copyright 2010 . All rights reserved.
//

#import "Database.h"

static sqlite3 *database = nil;

@implementation Database

/***********************************************************************************************************
 * Method Name 					 : Connetion()
 * Description 					 : class method to open connection with iPhone embedded sqlite database.
 * @Param 							 : nil
 * @return 							 : database object
 * Global Variables Used : Static Database Object;
 * Modification Log 
 * Date 									Author 										Description 
 * ---------------------------------------------------------------------------------------------------------
 * 10-May-2010						Hitesh Kumar Chawda 			Created
 ***********************************************************************************************************/
+ (Database*)Connetion {
	
	static Database *con = nil;
	
	if (con == NULL)
    {
		
		con = [[[Database alloc] init] autorelease];
		
		NSError *error = [[NSError alloc]init];
		NSFileManager *fileManager = [NSFileManager defaultManager];
		
		NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
		NSString *documentsDirectory = [paths objectAtIndex:0];
		NSString *path = [documentsDirectory stringByAppendingPathComponent:@"eFlashEngishinappnew.sqlite"];
		
		int success = [fileManager fileExistsAtPath:path];
		
		if (!success)
        {
			NSString *defaultDBPath = [[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:@"eFlashEngishinappnew.sqlite"];
			success = [fileManager copyItemAtPath:defaultDBPath toPath:path error:&error];
			if (!success) {
				NSAssert1(0, @"Failed to create writable database file with message '%@'.", [error localizedDescription]);
			}
		}
		
		if (success)
        {
			// Open the database. The database was prepared outside the application.
			if (sqlite3_open([path UTF8String], &database) == SQLITE_OK)
            {
				//
			} // Even though the open failed, call close to properly clean up resources.
			else
            {
				sqlite3_close(database);
				NSAssert1(0, @"Failed to open database with message '%s'.", sqlite3_errmsg(database));
				// Additional error handling, as appropriate...
				return NULL;
			}
		}
		//[error release];
	}
	
	return con;	
} //Connetion
-(NSString*)getDBPath
{
	NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
	NSString *documentsDirectory = [paths objectAtIndex:0];
	NSString *dbPath = [documentsDirectory stringByAppendingPathComponent:@"eFlashEngishinappnew.sqlite"];
	NSLog(@"%@",dbPath);
	return dbPath;
}
- (NSMutableDictionary *) getSettings
{
	NSMutableDictionary *tempData=nil;
	sqlite3_stmt *selectStatement;
    NSString *path = [self getDBPath];
    
    if (sqlite3_open([path UTF8String], &database) == SQLITE_OK)
    {
        const char *sql = "SELECT * FROM tbl_settings";
        
        if (sqlite3_prepare_v2(database, sql, -1, &selectStatement, NULL) != SQLITE_OK)
        {
            NSAssert1(0, @"Error: failed to prepare statement with message '%s'.", sqlite3_errmsg(database));
        } // if
        
        if (sqlite3_step(selectStatement) == SQLITE_ROW)
        {
            
            //Store the data in local variables from the sqlite database
           tempData = [[NSMutableDictionary alloc]
                                             initWithObjectsAndKeys: [NSNumber numberWithInt:sqlite3_column_int(selectStatement, 0)], @"id",
                                            [NSNumber numberWithInt:sqlite3_column_int(selectStatement, 1)], @"Voice",[NSNumber numberWithInt:sqlite3_column_int(selectStatement, 2)], @"RandomOrder",[NSNumber numberWithInt:sqlite3_column_int(selectStatement, 3)], @"Question",[NSNumber numberWithInt:sqlite3_column_int(selectStatement, 4)], @"Swipe",[NSNumber numberWithInt:sqlite3_column_int(selectStatement, 5)], @"ActualVoice", [NSNumber numberWithInt:sqlite3_column_int(selectStatement, 6)], @"English",                                       nil];
           
        } // while
    }
    else
    {
        //sqlite3_close(database);
        NSAssert1(0, @"Failed to open database with message '%s'.", sqlite3_errmsg(database));
        // Additional error handling, as appropriate...
        return NULL;
    }
	sqlite3_reset(selectStatement);
    sqlite3_finalize(selectStatement);
    sqlite3_close(database);
   
    return tempData;
}
- (NSInteger)saveSettings:(BOOL )ActualVoice Voice:(BOOL )Voice strRandomOrder:(BOOL )strRandomOrder Question:(BOOL)Question Swipe:(BOOL)Swipe English:(BOOL)English
{
    BOOL Success=false;
	sqlite3 *database = nil;
    sqlite3_stmt *updatStatement=nil;
   
	NSString *dbPath=[self getDBPath];
	
	
    if(sqlite3_open([dbPath UTF8String], &database) == SQLITE_OK)
    {
         NSString *sql =[NSString stringWithFormat: @"UPDATE tbl_settings SET ActualVoice='%d',Voice='%d',RandomOrder='%d',Question='%d',Swipe='%d',English='%d'",ActualVoice,Voice,strRandomOrder,Question,Swipe,English];
        
        if(updatStatement == nil)
        {
			if(sqlite3_prepare_v2(database,[sql UTF8String], -1, &updatStatement, NULL) != SQLITE_OK)
            {
                NSLog( @"Error while inserting '%s'", sqlite3_errmsg(database));
            }
		}
        if(SQLITE_DONE == sqlite3_step(updatStatement))
		{
            Success=true;
		}
		else
        {
            NSAssert1(0, @"Error while inserting data. '%s'", sqlite3_errmsg(database));
            Success=false;
        }
    }
    
    else
        Success=false;
    
	sqlite3_finalize(updatStatement);
	sqlite3_close(database);
    return Success;
    return false;
    
    return Success;
}


-(NSMutableArray*)GetAlliTems
{
	NSMutableArray *arrItems = [[[NSMutableArray alloc] initWithObjects:nil] autorelease];
	
    sqlite3_stmt *selectStatement;
    NSString *path = [self getDBPath];
  
    if (sqlite3_open([path UTF8String], &database) == SQLITE_OK)
    {
       
        NSString *tmpSQL = @"SELECT * FROM tbl_items ORDER BY LOWER(Title)";
        const char *sql = [tmpSQL UTF8String];
        if (sqlite3_prepare_v2(database, sql, -1, &selectStatement, NULL) != SQLITE_OK)
        {
            NSAssert1(0, @"Error: failed to prepare statement with message '%s'.", sqlite3_errmsg(database));
        } // if
        
        sqlite3_bind_text(selectStatement, 1, [tmpSQL UTF8String], -1, SQLITE_TRANSIENT);
        
        while (sqlite3_step(selectStatement) == SQLITE_ROW)
        {
            NSString *strActualSound= @"NA";
            
            if ( ![[NSString stringWithUTF8String:(char *)sqlite3_column_text(selectStatement, 5)] isKindOfClass:[NSNull class]])
            {
                strActualSound=[NSString stringWithUTF8String:(const char *)sqlite3_column_text(selectStatement, 5)];
            }
            //Store the data in local variables from the sqlite database
            NSMutableDictionary *tempData = [[NSMutableDictionary alloc]
                                             initWithObjectsAndKeys:
                                             [NSNumber numberWithInt:sqlite3_column_int(selectStatement, 0)], @"ID",
                                             [NSString stringWithUTF8String:(char *)sqlite3_column_text(selectStatement, 1)], @"Title",
                                             [NSString stringWithUTF8String:(char *)sqlite3_column_text(selectStatement, 2)], @"Category",
                                             [NSString stringWithUTF8String:(char *)sqlite3_column_text(selectStatement, 3)], @"Image",
                                             [NSString stringWithUTF8String:(char *)sqlite3_column_text(selectStatement, 4)], @"Sound",
                                             strActualSound, @"ActualSound",
                                             [NSString stringWithUTF8String:(char *)sqlite3_column_text(selectStatement, 5)], @"ActualSound",
                                             [NSNumber numberWithInt:sqlite3_column_int(selectStatement, 6)], @"Sort",
                                             nil];
            
            NSLog(@"Title-->%@",[NSString stringWithUTF8String:(char *)sqlite3_column_text(selectStatement, 1)]);
            
            [arrItems addObject:tempData];
            [tempData release];
        } // while
        NSLog(@"All Items:%@",arrItems);
    }
   
    else
    {
        sqlite3_close(database);
        NSAssert1(0, @"Failed to open database with message '%s'.", sqlite3_errmsg(database));
        // Additional error handling, as appropriate...
        return NULL;
    }
    
	sqlite3_reset(selectStatement);
    sqlite3_finalize(selectStatement);
    sqlite3_close(database);
	return arrItems;
}

@end