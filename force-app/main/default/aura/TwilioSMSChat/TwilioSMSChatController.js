({
    doInit : function(component, event, helper) {
        var action = component.get("c.getContact");
        action.setParams({ recordId : component.get("v.recordId") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                if(result.message == 'Success'){
                    try{
                        component.set("v.data",result.con);
                        if(result.smsList != undefined && result.smsList != null){
                            component.set("v.smsList",result.smsList);
                            setTimeout(function(){
                                  if(document.getElementById('listdown') != null && document.getElementById('listdown') != undefined){
                                document.getElementById('listdown').scrollTop = document.getElementById('listdown').scrollHeight
                                  }
                            },1000)
                        }
                    }
                    catch(e){
                        console.error(JSON.stringify(e));
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            title : e.name,
                            message: e.message,
                            duration:' 5000',
                            key: 'info_alt',
                            type: 'error',
                            mode: 'pester'
                        });
                        toastEvent.fire();
                    }
                }
                else{
                    console.log("Records are not present");
                }
            }
            else if (state === "INCOMPLETE") {
                console.log("Incomplete");
            }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    console.error(errors)
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + 
                                        errors[0].message);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
        });
        $A.enqueueAction(action);
    },
    
    handleClick : function(component, event, helper) {
        component.set("v.showLoadingSpinner",true)
        var getMessage = component.find("sendMessage").get("v.value")
        var action = component.get("c.sendMessage");
        action.setParams({ messageSend : getMessage, recordId : component.get("v.recordId") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                if(result.message == 'Success'){
                    component.set("v.smsList",result.smsList);
                    component.set("v.message",'')
                    component.set("v.showLoadingSpinner",false)
                    setTimeout(function(){
                        if(document.getElementById('listdown') != null && document.getElementById('listdown') != undefined){
                        document.getElementById('listdown').scrollTop = document.getElementById('listdown').scrollHeight
                        }
                    },1000)
                }
                else if(result.message == 'No Phone Number'){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Error',
                        message:'This is no phone number for this contact',
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                    component.set("v.showLoadingSpinner",false)
                    var element = document.getElementById("listdown");
                    element.scrollTo(0,element.scrollHeight);
                }
                else if(result.message == 'Phone Number is not Valid'){
                     var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Error',
                        message:'The Phone number is not registered.',
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                    component.set("v.showLoadingSpinner",false)
                    var element = document.getElementById("listdown");
                    element.scrollTo(0,element.scrollHeight);
                }
                component.set("v.showLoadingSpinner",false)
            }
            else if (state === "INCOMPLETE") {
                component.set("v.showLoadingSpinner",false)
                console.log("Incomplete");
            }
                else if (state === "ERROR") {
                    component.set("v.showLoadingSpinner",false)
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + 
                                        errors[0].message);
                        }
                    } else {
                        component.set("v.showLoadingSpinner",false)
                        console.log("Unknown error");
                    }
                }
        });
        $A.enqueueAction(action);  
    },
    
    handleChange : function(component, event, helper) {
        var check = event.getSource().get("v.value");
        if(check != undefined && check != ""){
            component.set("v.isDisabled",false) 
        }
        else{
            component.set("v.isDisabled",true); 
        }
        
    },
    
    checkCompatibility : function(component, event, helper) {
        var objectName = 'SMS_Integration__c';
        if(objectName){
            var channelName = helper.getChannelName(objectName);
            if(channelName){
                component.set("v.channelName", channelName);
                component.set("v.isSupported", true);
            } else{
                component.set("v.isSupported", false);
            }
            
        } else{
            component.set("v.isSupported", false);
        }
        debugger;
    },
    
    handleMessage : function(component, event, helper) {
        var action = component.get("c.doInit");
        $A.enqueueAction(action);  
    },
    
    handleComponentEvent : function(component, event, helper) {
        $A.get('e.force:refreshView').fire();
        
    },
    
    keyCheck : function(component, event, helper) {
        var enterKey = event.which;
        console.log("Enter :  "+enterKey)
        if(enterKey == 13){
            var act = component.find("sendMessage").get("v.value");
            console.log("value : "+act)
            if(act !== undefined && act !== null && act !== ''){
                var action = component.get("c.handleClick")
                $A.enqueueAction(action);  
            }
            
        }
        
    }
})