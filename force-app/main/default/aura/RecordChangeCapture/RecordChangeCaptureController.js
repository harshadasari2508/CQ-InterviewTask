({
    checkCompatibility : function(component, event, helper){
        alert("ok")
    
        //get current object
        var objectName = 'SMS_Integration__c';
         alert(objectName)
        //Check is object name is not undefined/null
        if(objectName){
            //Get channel name for change event
            var channelName = helper.getChannelName(objectName);
             alert(channelName)
            //Check if channel name is not null or undefined
            if(channelName){
                component.set("v.channelName", channelName);
                //setting supported varibale true
                component.set("v.isSupported", true);
                 alert(channelName)
            } else{
                 alert(channelName)
                //Object does not support change event
                component.set("v.isSupported", false);
            }
            
        } else{
            alert("ok2")
            //Object name is undefined or null, hence component will not support this page
            component.set("v.isSupported", false);
        }
        debugger;
    },
    
    /**
     * Handling the message when change event is fired.
     * */
    handleMessage : function(component, event, helper) {
        alert("hanlde");
        debugger;
        const message = event.getParam('recordData');
        const eventType = message.payload.ChangeEventHeader.changeType;
        const entityName = message.payload.ChangeEventHeader.entityName;
        const userId = message.payload.ChangeEventHeader.commitUser.substring(0,15); //15 digit id of transaction commit user
        const signedInUser= $A.get("$SObjectType.CurrentUser.Id").substring(0,15); //15 digit id of logged in user
         alert(signedInUser);
        /**
         * Conditions:
         * - Change Type should not be create
         * - Record Id must present in modified recordIds
         * - User who modified the record should not be logged in user
         * */
        
        if(eventType === "CREATE"){
            alert(eventType);
            console.log(JSON.stringify(message.payload.ChangeEventHeader.recordIds))
            //Condition 1 - Change type is not "created"
            Array.from(message.payload.ChangeEventHeader.recordIds).forEach( recordId => {
             //   if(recordId === component.get("v.recordId") && !(signedInUser === userId)){
                  //  if(recordId === component.get("v.recordId")){
                    //Condition 2 - Record Id match found &&
                    //Condition 3 - commit user is not logged in user
                alert("condition1")
                    //Display console log with changed values
                    console.log(`${eventType} event captured on ${entityName} by user id ${userId}`);
                    /*console.log("Values changed are:");
                    for(k in message.payload){
                        if(k){
                            console.log(`Field Name: ${k} | New Value:${message.payload[k]}`);
                        }
                    }*/
            
                    //Now call helper function to get user name and display toast
                     alert("condition2")
                    helper.getUser(component, userId, eventType, entityName);
              alert("condition3")
            //	}
             });
        }
    }
})