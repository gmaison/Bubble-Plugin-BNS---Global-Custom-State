function(instance, context) {

	instance.data.id = 'gcs_'+Math.random().toString(36).substr(2, 9);
        
	if (!window.isGcsManagerSet) {
        
    	window.gcsInstances = [];
        
        window.gcs = {};

        // find a channel.event 
        window.findGcs = function (pInstance, pDataType, pGcsName) {
            let foundItem = null;
            if (window.gcs[pDataType][pGcsName]) {
                foundItem = window.gcs[pDataType][pGcsName].gcsInstances.find(lGcs => (lGcs.data.id === pInstance.data.id));
            };
            return foundItem;

        };

        window.spreadGcs = function () {
			const lTypes = Object.keys(window.gcs);
            for (let lType of lTypes) {
                const lNames = Object.keys(window.gcs[lType]);
                for (let lName of lNames) {
                    for (let lGcs of window.gcsInstances) {
                        lGcs.publishState("custom_states", lNames);
                    }
                }            
            }
        }
        
        window.gcsCreategcs = function (pDataType, pGcsName) {
            
            if (!window.gcs[pDataType]) {
                window.gcs[pDataType]= {};
            }
            window.gcs[pDataType][pGcsName] = {
                gcsValue: null,
                gcsDefaultValueOverriden: false,
                gcsName: pGcsName,
                gcsDataType: pDataType,
                gcsValueList: null,
                gcsDefaultValueListOverriden: false,
                gcsPersistent: false,
                gcsInstances: []
            };

        };
        
        window.gcsBind = function (pInstance, pDataType, pGcsName) {

            let isFirst = false;
            
            if (!window.gcs[pDataType] ) {
				window.gcsCreategcs(pDataType, pGcsName);
                isFirst = true;
            } else if(!window.gcs[pDataType][pGcsName]) {
				window.gcsCreategcs(pDataType, pGcsName);
                isFirst = true;
            }

            let lFound = window.findGcs(pInstance, pDataType, pGcsName);
			
            // you can't bind twice a same Global Custom State from a same instance
            if (!lFound) {

                // This is to register all the Global Custom States
                window.gcs[pDataType][pGcsName].gcsInstances.push(pInstance);
                lFound = pInstance;

            }
            
			lFound.data.gcsDataType = pDataType
            lFound.data.gcsName = pGcsName;
 			lFound.data.gcsIsFirst = isFirst;
            lFound.data.gcsValue = window.gcs[pDataType][pGcsName].gcsValue;
            lFound.data.gcsValueList = window.gcs[pDataType][pGcsName].gcsValueList;
            lFound.publishState("custom_state_name",pGcsName);
            lFound.publishState("custom_state_value",window.gcs[pDataType][pGcsName].gcsValue);
            lFound.publishState("custom_state_value_list",window.gcs[pDataType][pGcsName].gcsValueList);
			window.spreadGcs();
        };
        
        window.gcsSetSingleValue = function (pInstance, pDataType, pGcsName, pValue, pOverrideDefault) {

            // i can set value if : 
            // - Default Value is not overriden
            // OR
            // - default value is Overriden AND pOverrideDefault = true)
            
            let canSetValue = (!window.gcs[pDataType][pGcsName].gcsDefaultValueOverriden) || (window.gcs[pDataType][pGcsName].gcsDefaultValueOverriden && (pOverrideDefault==true));
            
            if (window.gcs[pDataType][pGcsName] && canSetValue) {
                window.gcs[pDataType][pGcsName].gcsValue = pValue;
                window.gcs[pDataType][pGcsName].gcsDefaultValueOverriden = pOverrideDefault;

                for (let lGcs of window.gcs[pDataType][pGcsName].gcsInstances) {
                    lGcs.data.gcsValue = pValue;
                    lGcs.publishState("custom_state_value", pValue);
                }
            }
        };

		window.gcsSetListValue = function (pInstance, pDataType, pGcsName, pValue, pOverrideDefault) {

            let canSetValue = (!window.gcs[pDataType][pGcsName].gcsDefaultValueListOverriden) || (window.gcs[pDataType][pGcsName].gcsDefaultValueListOverriden && (pOverrideDefault==true));
            if (window.gcs[pDataType][pGcsName] && canSetValue) {
                window.gcs[pDataType][pGcsName].gcsValueList = pValue;
                window.gcs[pDataType][pGcsName].gcsDefaultValueListOverriden = pOverrideDefault;

                for (let lGcs of window.gcs[pDataType][pGcsName].gcsInstances) {
                    lGcs.data.gcsValueList = pValue
                    lGcs.publishState("custom_state_value_list", pValue);
                }
            }
        };

        window.removeGcs = function (pInstance, pDataType, pGcsName) {

            if (window.gcs[pDataType][pGcsName]) {
                const lIndexOf = window.gcs[pDataType][pGcsName].gcsInstances.findIndex(lGcs => (lGcs.data.id === pInstance.data.id));
                window.gcs[pDataType][pGcsName].gcsInstances.splice(lIndexOf, 1);
                /* if (window.gcs[pGcsName].gcsInstances.length===0) { 
										
				};*/
            };
        };


        window.gcsUnbind = function (pInstance, pDataType, pGcsName) {
            if (window.gcs[pGcsName]) {

                let foundHook = window.findGcs(pInstance, pDataType, pGcsName);

                if (foundHook) {

                    window.removeGcs(pInstance, pDataType, pGcsName);

                };
            };
        };    

        window.isGcsManagerSet = true;
    }

	if (window.isGcsManagerSet) {
        
    	window.gcsInstances.push(instance);
        
    }
}
