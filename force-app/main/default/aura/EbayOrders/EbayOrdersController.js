({
    myAction : function(component, event, helper) {
        
    },
    CallEbaySignIn : function(component, event, helper){
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url":"/apex/EbayConnectVF?parametername="+"parametervalue"
        });
        urlEvent.fire();
    },
    getOrders : function(component, event, helper){
        //alert('------------GET-ORDERS----');
        var action = component.get("c.doAuthorize");
        component.set("v.spinner", true);
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS"){
                component.set("v.OdersListIsTrue", true);
                //	alert('------------state----'+state);
                component.set('v.Ordercolumns', [
                    {label: 'OrderId',fieldName:'orderId', type: 'text'},
                    {label: 'BuyerName',fieldName:'username', type: 'text'},
                    {label: 'SellerId',fieldName:'sellerId',  type: 'text'},
                    {label: 'CreatedDate',fieldName:'creationDate',  type: 'date'},
                    {label: 'Amount',fieldName:'totalFeeBasisAmount',  type: 'text'},
                    {label: 'OrderPaymentStatus',fieldName:'orderPaymentStatus',  type: 'text '},
                    {label: 'PaymentMethod',fieldName:'paymentSummary',  type: 'text '},
                    {label: 'CancelStatus',fieldName:'cancelStatus',  type: 'text '}
                ]);
                console.log(JSON.parse(response.getReturnValue()))
                var parsedData = JSON.parse(response.getReturnValue())
                var orderList = [];
                for(var i=0;i<parsedData.orders.length;i++){
                    var obj = {};
                    obj['orderId'] = parsedData.orders[i]['orderId'];
                    obj['username'] = parsedData.orders[i]['buyer']['username'];
                    obj['sellerId'] = parsedData.orders[i]['sellerId'];
                    obj['creationDate'] = parsedData.orders[i]['creationDate'];
                    obj['totalFeeBasisAmount'] = parsedData.orders[i]['totalFeeBasisAmount']['value'];
                    obj['orderPaymentStatus'] = parsedData.orders[i]['orderPaymentStatus'];
                    obj['paymentSummary'] = parsedData.orders[i]['paymentSummary']['payments']['0']['paymentMethod'];
                    obj['cancelStatus'] = parsedData.orders[i]['cancelStatus']['cancelState'];
                    orderList.push(obj)
                }
                //alert('orderList------->'+orderList);
                component.set("v.OrderList",orderList);
                component.set("v.spinner", false);
            }else{
                component.set("v.spinner", false);
                alert('------------Fail');
            }
        });
        $A.enqueueAction(action);
        
    }
})