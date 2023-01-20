({
    doInit : function(component, event, helper) {
        var action = component.get("c.getData");
        action.setParams({ recordId : component.get("v.recordId") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                if(result.state == 'Success'){
                    let orgId = result.OrgId.slice(0,15);
                    let contactId = component.get("v.recordId").slice(0,15);
                    let networkId = result.NetWorkId.slice(0,15);
                    let userId = result.UserId.slice(0,15);
                    let url = 'https://dfl-8e-dev-ed.my.salesforce.com/servlet/servlet.su?oid='+orgId+'&retURL=%2F'+contactId+'&sunetworkid='+networkId+'&sunetworkuserid='+userId;
                    window.open(url);
                  //  window.open('https://dfl-8e-dev-ed--c.visualforce.com/apex/customLoginPage?core.apexpages.request.devconsole=1');
                    $A.get("e.force:closeQuickAction").fire();
                }
                else{
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Error',
                        message: result.message,
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                    $A.get("e.force:closeQuickAction").fire();
                }
            }
            else if (state === "INCOMPLETE") {
                console.log('Incomplete');
            }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    console.error(errors);
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
    }
})