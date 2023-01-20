trigger TaskTrigger on Task (before insert,after update) {
    
    if(Trigger.isAfter && Trigger.isUpdate){
        TaskTriggerHandler.activateAccountWhenTaskIsCompleted(trigger.new,trigger.oldMap);
    }
}