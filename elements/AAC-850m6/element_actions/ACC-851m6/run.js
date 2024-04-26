function(instance, properties, context) {


  //Load any data 

    let values= null;
    
    if (window.isGcsManagerSet) {
        if (properties.list_value) {
            values = properties.list_value.get(0, properties.list_value.length())
        };
        window.gcsSetListValue(instance, instance.data.gcsDataType, instance.data.gcsName, values, true);
    }

  //Do the operation



}