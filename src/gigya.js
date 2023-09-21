const template = document.createElement('template');
template.innerHTML = ` 
<div>
    <div id="logged-out"  hidden> <h3>Welcome</h3> </div> 
    <div id="logged-in" ><h3>Please Login</h3></div>
    <div id="error"><h3>Heta Pally</h3></div>
    <script id="gigya-script" async  crossOrigin="anonymous" ></script>
</div>
   `;
 
class GigyaStore extends HTMLElement {
      apiKey ;
      state;

      static get observedAttributes() {
          return ["state" , "apiKey"];
       }

      constructor(  ) { 
       super();
       this.attachShadow({mode:'open'})

      //  const shadowRoot = this.attachShadow({ mode: "open" }); 
        console.log('constructor this.apiKey' ,this.apiKey)
 
        this.onLoadHandler.bind(this);
        this.onLoginHandler.bind(this);
        this.onLogoutHandler.bind(this);
     }


     connectedCallback() {  
        this.apikey = this.getAttribute('apikey');
        this.domain = this.getAttribute('domain');
        this.debug = this.getAttribute('debug');

        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.getElementById('gigya-script').onload = () => this.onLoadHandler(gigya); 
        this.update(this.apiKey, this.domain);
      }

 
     onLoadHandler(gigya){
       this.gigya=gigya;
       console.log('Gigya loaded 🥳');
      this.debug && gigya.showDebugUI();
      gigya.accounts.addEventHandlers({
        onLogin: this.onLoginHandler,
        onLogout: this.onLogoutHandler
      });
     }
 

      onLoginHandler (e)  {
         console.log('login' ,e);
         this.state = "logged-in"; 
      } 

      onLogoutHandler (e)  {
         console.log('logout' ,e);
         this.state = "logged-out";
       }

   
     attributeChangedCallback(name, oldValue, newValue) {  
          console.log('attributeChangedCallback', {name, oldValue, newValue, apiKey:this.apiKey});
          if(name == "apiKey" && oldValue !== newValue ) {
            this.apiKey = newValue;
            this.updateApiKey(oldValue, newValue);
          }

          if(name == "state"){
            this.updateState(oldValue, newValue)
          }
      } 

     updateApiKey(oldValue, newValue) {
        
        this.shadowRoot.getElementById('gigya-script').src =this.getUrl({
          apiKey: newValue,
          domain: this.domain
        }) 
      }

      updateState(oldValue, newValue) {
        this.shadowRoot.getElementById(newValue).style.display = 'block';
        this.shadowRoot.getElementById(oldValue).style.display = 'none';
        this.state=newValue;
      }


      getUrl({apiKey, domain}) {
            return `https://cdns.${domain}/js/gigya.js?apikey=${apiKey}`;
       }
  
      
        

            
    }
   
   
