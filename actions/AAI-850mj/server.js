async function(properties, context) {

    //https://rest.ably.io/keys/{{API_KEY_NAME}}/requestToken
    let apiKey = context.keys["Ably API Key"];

    let keyName = /^[^:]+/g.exec(apiKey)[0];
    
    let urlPath = "https://rest.ably.io/keys/"+keyName+"/requestToken"

    const myOptions = {
                method: "POST",
                headers: {
                    "Authorization": "Basic "+btoa(apiKey),
                    "Content-type" : "application/json"
                },
                body: JSON.stringify({
                    clientId: properties.clientId,
                    keyName: keyName,
                    timestamp: (new Date()).getTime(),
                    ttl:properties.ttl
                })
    		};
        
	console.log("[BubbleAPI] myOptions: ", myOptions);
    
    try {
    
        const response = await fetch(urlPath, myOptions);
        
        console.log("[BubbleAPI] Response Status: "+response.status+" - "+response.statusText);
        
        const body = response.json();
        return body;
        
    } catch (error) {
        return {
            error: "[error] : "+error.toString()
        }
    }
    
    /* Returned Value :
        {
            "token": "{{APP_ID}}.HHZNjgqmC-ACW....truncated",
            "keyName": "{{API_KEY_NAME}}",
            "issued": 1449745478956,
            "expires": 1449749078956,
            "capability":"{\"*\":[\"subscribe\"],\<a href="[\">private\</a>"presence\",\"publish\",\"subscribe\"]}",
            "clientId": "unique_identifier"
        }
    */



}