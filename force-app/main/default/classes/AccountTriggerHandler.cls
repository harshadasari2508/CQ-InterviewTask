public class AccountTriggerHandler {
    
    //Inserting a task when account is created.
    public static void insertTaskWhenAccountIsAdded(List<Account> AccList){
        
        List<Task> taskListToInsert = new List<Task>();
        
        for(Account accItem : AccList){
            Task accountTask = new Task();
            accountTask.Subject = 'Review Account- '+accItem.AccountNumber;
            accountTask.ActivityDate = system.today().addDays(7);
            accountTask.OwnerId = accItem.OwnerId;
            accountTask.Status = 'Not Started';
            accountTask.WhatId = accItem.Id;
            taskListToInsert.add(accountTask);
        }
        
        if(taskListToInsert.size() > 0){
            insert taskListToInsert;
        }
    }
    
    //Updating the releated task whenever Account is updated.
    public static void updateTaskWhenAccountIsActivated(List<Account> AccList,Map<Id,Account> OldAccountMap){
        
        List<Task> taskListToUpdate = new List<Task>();
        Map<Id,List<Task>> accountTaskListMap = new Map<Id,List<Task>>();
        List<Task> taskList = [Select id,Status,WhatId from Task Where WhatId IN: OldAccountMap.keySet()];
        
        for(Task taskItem : taskList){
            if(taskItem.Status != 'Completed'){
                if(accountTaskListMap.get(taskItem.WhatId) != null){
                    List<Task> taskItemList = accountTaskListMap.get(taskItem.WhatId);
                    taskItemList.add(taskItem);
                    accountTaskListMap.put(taskItem.WhatId, taskItemList);
                }else{
                    List<Task> taskItemList = new List<Task>();
                    taskItemList.add(taskItem);
                    accountTaskListMap.put(taskItem.WhatId, taskItemList);
                }
            }
        }
        
        for(Account accItem : AccList){
            if(accItem.Active__c == true && OldAccountMap.get(accItem.Id).Active__c != accItem.Active__c){
                if(accountTaskListMap.get(accItem.Id) != null){
                    for(Task taskItem : accountTaskListMap.get(accItem.Id)){
                        Task taskItemUpdate = new Task();
                        taskItemUpdate.Id = taskItem.Id;
                        taskItemUpdate.Status = 'Completed';
                        taskListToUpdate.add(taskItemUpdate);
                    }
                }
            }
        }
        if(taskListToUpdate.size() > 0){
            update taskListToUpdate;
        }
    }
}