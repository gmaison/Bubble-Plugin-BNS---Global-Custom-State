function(instance, properties, context) {

    if (window.isGcsManagerSet) {
        
        // the datatype is the main thing to set
        // if not set, then nothing is done.
        if (properties.global_custom_state_value_datatype) {
            
            instance.data.gcsDataType = properties.global_custom_state_value_datatype;
            
            if (properties.global_custom_state_name) {

				// let's bind
                // if already binded
                if (instance.data.gcsName) {

                    // if names are different ==> unbind and then bind. Else nothing happens
                    if (instance.data.gcsName !== properties.global_custom_state_name) {

                        window.gcsUnbind(instance, properties.global_custom_state_value_datatype, instance.data.gcsName);
                        window.gcsBind(instance, properties.global_custom_state_value_datatype, properties.global_custom_state_name);
                    }

                } else {

					// Not binded already so ...
                    window.gcsBind(instance, properties.global_custom_state_value_datatype, properties.global_custom_state_name);
                }

                // We set value only if it is the first one to register the GCS
                if (instance.data.gcsIsFirst) {

                        // let's handle the single value
					window.gcsSetSingleValue(instance, properties.global_custom_state_value_datatype, instance.data.gcsName, properties.global_custom_state_value, false);
                    // let's handle the value list
                    let lValueList = null;
                    if (properties.global_custom_state_value_list) {
                        lValueList = properties.global_custom_state_value_list.get(0, properties.global_custom_state_value_list.length());
                    }
                    window.gcsSetListValue(instance, properties.global_custom_state_value_datatype, instance.data.gcsName, lValueList, false);
                }
            }
            
        }        
    };
}