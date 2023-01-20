public class TaskTriggerHandler {
    //Update Activate checkbox in Account to true, when related task is completed.
    public static void activateAccountWhenTaskIsCompleted(List<Task>TaskList,Map<Id,Task> OldTasksMap){
        
        List<Account> accountListToUpdate = new List<Account>(); 
        
        for(Task taskItem : TaskList){
            system.debug('---------------'+OldTasksMap.get(taskItem.Id).Status);
            if(taskItem.Status == 'Completed' && OldTasksMap.get(taskItem.Id).Status != taskItem.Status){
                Account taskAccount = new Account();
                taskAccount.Id = taskItem.WhatId;
                taskAccount.Description = taskItem.Description;
                taskAccount.Active__c = true;
                accountListToUpdate.add(taskAccount);
            }
        }
        if(accountListToUpdate.size() > 0){
            update accountListToUpdate;
        }
    }
}