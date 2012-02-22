# PushApp Sample
The _**PushApp Sample"__ repository provides a frankstein/airplane code example of how you can implement a BlackBerry Push Application for your desktop.  This example was built using Java Swing components for the UI, and uses Java Derby for persisting your payloads for easy reuse.  Since this application was built on an airplane, with no design, and by an author that codes in 5 languages a day,  you will see different flavors of coding and should use at your own risk.  That’s the cool thing about open source!  Try it, use it, update it, and spread the word about it.


All APIs and samples shared in this repository are Open Source under the  [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0.html)
To contribute code to this repository, make sure you have signed up as an [official contributor](https://github.com/blackberry/WebWorks/wiki/How-to-Contribute).


[FEATURES:

1.	Store BlackBerry Enterprise Server [BES] + CallBack Server Details: use the configuration tab to setup your environment details.  *Note:  when using this application your system must be able to access to BES server in order to work.  If you are testing using this application to test push clients, your BES port will either be “28080” (Ripple) or “8080” (Stand Alone MDS). 
2.	Validate a user’s BlackBerry Enterprise Server (BES): application will check the loaded or created recipients on the “Recipients” tab against the BES servers listed on the “Configuration” tab.
3.	Push Contacts to Recipients: application will push a contacts JSON payload.  
4.	Push Emergency Call to Recipients: application will push an emergency call JSON payload.
5.	Push Emergency Notification to Recipients: application will push an emergency notification payload.

:/Features]


[TODOs: 

	1`.  Tweak and Clean: Interfaces PLEASE!
  	2.   Work Active Sync hooks

:/TODOs]

## Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


## Code Organization
