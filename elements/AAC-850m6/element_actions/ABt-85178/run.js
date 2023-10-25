function(instance, properties, context) {


  //Load any data 

    if (window.isGcsManagerSet) {
		window.gcsSetSingleValue(instance, instance.data.gcsDataType, instance.data.gcsName, properties.value, true);
    }

  //Do the operation

}