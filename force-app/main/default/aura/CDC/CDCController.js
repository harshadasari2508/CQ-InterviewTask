({
	onInit : function(component, event, helper) { 
        const empApi = component.find('empApi');           
        // Register error listener and pass in the error handler function 
        empApi.onError($A.getCallback(error => { 
            // Error can be any type of error (subscribe, unsubscribe…) 
            console.error('EMP API error: ', error); 
        })); 
    },  
})