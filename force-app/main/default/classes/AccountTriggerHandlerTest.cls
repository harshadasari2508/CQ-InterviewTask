@isTest
public class AccountTriggerHandlerTest {
    @testSetup
    static void setup() {
       
        Account testAccount = new Account(Name='Test Account',AccountNumber = '12456788',Active__c = false);
        insert testAccount;
        
    }
    //Check Task is created or not when account is Inserted.
    static testMethod void InsertAccount(){
        Account Acc = [select Id,Name,Active__c from Account limit 1];
        List<Task> TaskList = [Select id,Status,WhatId from Task where WhatId =:Acc.Id];
        system.Assert(TaskList.size() > 0,'Task should be created.');
    }
    
    //Check Task is updated or not when account activation is updated.
    static testMethod void UpdateAccount(){
        
        List<Profile> profiles = [SELECT ID FROM Profile WHERE Name = 'Standard User'];
        
        
        User user = new User();
        user.Username =  'testcustomuser1@user.com';
        user.Email = 'testcustomuser1@gmail.com';
        user.FirstName =  'atest';
        user.LastName = 'user1';
        user.CommunityNickname = 'tuser';
        user.ProfileId = profiles[0].Id;
        
        user.Alias =  'tuser';
        user.EmailEncodingKey = 'UTF-8';
        user.LanguageLocaleKey = 'en_US';
        user.LocaleSidKey = 'en_US';
        user.TimeZoneSidKey = 'America/Los_Angeles';
        
        insert user;
        
        List<PermissionSet> permissionSets = [SELECT Id FROM PermissionSet WHERE Name = 'CQ_Account_Admin'];
        if(permissionSets.size() > 0){
            PermissionSetAssignment  assignPermission=   new PermissionSetAssignment(AssigneeId=user.Id, PermissionSetId=permissionSets[0].Id);
            insert assignPermission;
            
        }
        user customUser = [select Id from User where UserName = 'testcustomuser1@user.com'];
        system.runAs(customUser){
            
            Account Acc = [select Id,Name,Active__c from Account limit 1];
            Acc.Active__c = true;
            update Acc;
            
            
            List<Task> TaskList = [Select id,Status,WhatId from Task where WhatId =:Acc.Id];
            system.Assert(TaskList[0].Status == 'Completed','Task status is not updated.');
        }
    }
}