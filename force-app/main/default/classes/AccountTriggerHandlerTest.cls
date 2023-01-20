@isTest
public class AccountTriggerHandlerTest {
    @testSetup
    static void setup() {
        
        Account testAccount = new Account(Name='Test Account',AccountNumber = '12456788',Active__c = false);
        insert testAccount;
        
    }
    
    static testMethod void InsertAccount(){
        Account Acc = [select Id,Name,Active__c from Account limit 1];
    }
    
    static testMethod void UpdateAccount(){
        Account Acc = [select Id,Name,Active__c from Account limit 1];
        Acc.Active__c = true;
        update Acc;
        
        List<Task> TaskList = [Select id,Status,WhatId from Task where WhatId =:Acc.Id];
        system.Assert(TaskList[0].Status == 'Completed','Task status is not updated.');
    }
}