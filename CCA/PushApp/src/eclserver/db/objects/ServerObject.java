/*
* Copyright 2011 Research In Motion Limited.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
package eclserver.db.objects;

/**
 *
 * @author rbalsewich
 */
public class ServerObject {
    
    /**
     * Creates a new instance of ServerObject
     */
    public ServerObject() {
    }
         
    public ServerObject(String serverHost, String serverPort) {
        
        this(serverHost, serverPort,  -1);
    }
    
    public ServerObject(String serverHost, String serverPort, int id) {
        this.serverHost = serverHost;
        this.serverPort = serverPort;
        this.id = id;
    }

    public void setServerHost(String serverHost) {
        this.serverHost = serverHost;
    }
    
    public String getServerHost() {
        return serverHost;
    }
    
    public void setServerPort(String serverPort) {
        this.serverPort = serverPort;
    }
    
    public String getServerPort() {
        return serverPort;
    }
    
    public void setId(int id) {
        this.id = id;
    }
    
    public int getId() {
        return id;
    }
    
      public String getName() {
        return serverHost + ": " + serverPort;
    }
    
    public int hashCode() {
        int value = 1;
        value = value*PRIMENO + (serverHost == null ? 0 : serverHost.hashCode());
        value = value*PRIMENO + (serverPort == null ? 0 : serverPort.hashCode());
        
        
        // don't use the id since this is generated by db
        
        return value;
    }
    
    
    public boolean equals(Object other) {
        boolean bEqual = false;
        if (this == other) {
            bEqual = true;
        } else if (other instanceof ServerObject) {
            ServerObject thatServerObject = (ServerObject) other;
            if ((serverHost == null ? thatServerObject.serverHost == null : serverHost.equalsIgnoreCase(thatServerObject.serverHost)) &&
                    (serverPort == null ? thatServerObject.serverPort == null : serverPort.equalsIgnoreCase(thatServerObject.serverPort))) {
                // don't use id in determining equality                
                bEqual = true;
            }
        }
        
        return bEqual;
    }
   
    
    private String serverHost;
    private String serverPort;
    private int id;
    
    private static final int PRIMENO = 37;
    
}

