@isTest
public class TaskTriggerHandlerTest {
     @testSetup
    static void setup() {
        
        Account testAccount = new Account(Name='Test Account',AccountNumber = '12456788',Active__c = false);
        insert testAccount;
        
        Task taskRecord = new Task(Description = 'TestDescription',WhatId = testAccount.Id,Status = 'Not Started');
        insert taskRecord;
    }
    
    static testMethod void updateTask(){
        Task taskList = [select Id,WhatId,Status from Task limit 1];
        taskList.Status = 'Completed';
        update taskList;
        Account accountItem = [Select id,Active__c from Account Where Id =: taskList.WhatId];
        system.Assert(accountItem.Active__c , 'Active should be true');
    }

}