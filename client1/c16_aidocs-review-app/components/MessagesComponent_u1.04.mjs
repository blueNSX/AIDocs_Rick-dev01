/*\
##=========+====================+================================================+
##RD        Messages Component  | For AIDocs-Review Chat App
##RFILE    +====================+=======+===============+======+=================+
##FD   MessagesComponent.mjs    |   8342|  4/11/24  7:02|   165| u1.03`40411.0702
##FD   MessagesComponent.mjs    |  10734|  4/11/24  9:30|   203| u1.03`40411.0930
##FD   MessagesComponent.mjs    |  10869|  4/12/24 15:20|   206| u1.04`40412.1520
##DESC     .--------------------+-------+---------------+------+-----------------+
#           This JavaScript file creates the HTML tag: messages-component.
#           It is defined in the class MessagesComponent that includes styles that
#           are local to the component.
##LIC      .--------------------+----------------------------------------------+
#           Copyright (c) 2024 8020-Data_formR * Released under
#           MIT License: http://www.opensource.org/licenses/mit-license.php
##FNCS     .--------------------+----------------------------------------------+
#           MessagesComponent       extends LitElement class
#             get styles
#             get properties
#             constructor
#             fetchMessages
#             populateMessages
#             render
#               renderMessage
#           Alert
##CHGS     .--------------------+----------------------------------------------+
# .(40405.03  4/05/24 RAM  8:30a|  Rewrite passing promptValue
# .(40405.04  4/05/24 RAM  5:00p|  Fix pMessages error handling
# .(40405.05  4/05/24 RAM  5:30p|  Add bNoAlert to browser Alert()
# .(40405.06  4/05/24 RAM  6:30p|  Add bNoAlert to browser Alert()
# .(40408.01  4/08/24 RAM  4:00p|  Modify Rick's CSS Styles
# .(40411.03  4/11/24 RAM  9:30a|  Add <br>s to chat response
# .(40412.01  4/12/24 RAM  3:20p|  Add JPT's Doc Header Info
                                |
##SRCE     +====================+===============================================+
\*/
  import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
//import { unsafeCSS             } from 'https://cdn.jsdelivr.net/npm/lit-html@3.1.2/directives/unsafe-css.js'
  import { unsafeHTML            } from 'https://cdn.jsdelivr.net/npm/lit-html@3.1.2/directives/unsafe-html.js'  // .(40411.03.4)
  import { getPromptValue        } from '../utils/GlobalState_u1.02.mjs';
  import   MessagesFns             from '../utils/getData_u1.03.mjs'

  //-------------------------------------------------------------------------------
    var aUserColor = '#AAA' // '#9ad8e3'  // Light blue
    var aAsstColor = '#CCC' // '#338b33'  // Dark Green

function setColor( aColor, aWhere ) {
 if (`${aWhere}`.match(/^f/)) {
return (aColor.substr(1,1) <= 7) ? '#000' : '#FFF' }
return  aColor
        }

  class MessagesComponent_ extends LitElement {

    static get styles() {
      return css`
      //  -------------------------------------------------------
      :host {
        --User-BackgroundColor      : #9ad8e3; /* #AAA     #9ad8e3; Light blue */
        --User-FontColor            : #333;    /* #000     #333;    Dark */
        --Assistant-BackgroundColor : #338b33; /* #CCC     #338b33; Dark green */
        --Assistant-FontColor       : #fff;;   /* #000     #fff;;   White */
         }
        #spacer {
          height          :  50px;                                 /* .(40408.01.6 RAM Was: 20px; in v1.03.40408.1233-Rick) */
          }
        #messages-container_x {
          display         :  flex;
          width           :  80%;
          flex-direction  :  column;
          margin          :  0 auto;
          padding         :  20px;
          border          :  1px solid #ddd;
          border-radius   :  5px;
          }

        .message {
          flex            :  1;
          max-width       :  550px;
          min-width       :  300px;
          min-height      :  15px;
          margin          :  5px auto;
          margin-left     :  80px;
          margin-right    :  6px;
          padding         :  5px;             /* was 20px; or 10px; */

          border          :  2px solid #ddd;  /* or #ccc */
          border-radius   :  5px;
  /*      box-shadow      :  0px 1px 3px #000000; */
          border-style    :  inset;

          font-family     :  sans-serif;
          font-size       :  14px;
          }

        .user-message {
          background-color: #9ad8e3;  /* var(--User-BackgroundColor);  */
          color           : #000;     /* var(--User-FontColor);  */
          text-align      : left;
          margin-left     : 52px;
          }

        .assistant-message {
          background-color: blue;     /* #338b33; /* var(--Assistant-BackgroundColor); */
          color           : #fff;     /* var(--Assistant-FontColor); */
          text-align      : left;
          }
      `;
      }
//    ---------------------------------------------------------

    static get properties() {
        return { messages: { type: Array } };
        }
//    ---------------------------------------------------------

    constructor( ) {
        super();
/*
    var pMessages =
         [ { role: 'user',      message: "What's up" },
         , { role: 'assistant', message: "Not much" },
         , { role: 'user',      message: "What's really up" },
         , { role: 'assistant', message: "Really not much" },
             ];
*/
        this.NoAlert  = true                                                                                // .(40405.06.11)
        this.Messages = []
//      this.fetchMessages( "" );        										// Call the method to fetch data

        } // eof constructor
//    ---------------------------------------------------------

  async fetchMessages( aPromptValue ) {
  try {
        Alert( `Fetching messages for, '${aPromptValue}'`, this.NoAlert )                                   // .(40405.05.2).(40405.06.12)

    var pMessages     =  await MessagesFns.getChatMessages( aPromptValue, this.Messages )
    if (pMessages.slice(-1)[0].error) {                                                                     // .(40405.04.6 RAM Handle error)
        Alert( `${ pMessages.slice(-1)[0].error.message }`, -2 )                                            // .(40405.05.3)
    } else {                                                                                                // .(40405.04.7)
    var nMsgs         =  pMessages.length / 2, s = (nMsgs != 1) ? "s" : "";                                 // .(40405.04.8)
        Alert( `Received ${nMsgs} message${s} from MessagesFns.getChatMessages()`, this.NoAlert )           // .(40405.05.4).(40405.06.13)

        this.Messages =  pMessages;
        this.requestUpdate( );                    								// Trigger a re-render
        }                                                                                                   // .(40405.04.9)
    } catch (pError) {
        Alert(    `* Error fetching messages data: ${pError}`, -2 )                                         // .(40405.05.5)
        console.error( '* Error fetching messages data:', pError );
        }
        }  // eof fetchMessages
//    ---------------------------------------------------------

  async populateMessages( aPromptValue ) {
//      const promptValue = promptValue ? promptValue : await getPromptValue( );                            //#.(40405.03.1 RAM Retrieve prompt value from global state)
        aPromptValue = aPromptValue ? aPromptValue : await getPromptValue( );                               // .(40405.03.1 RAM Don't use const to redefine promptValue)

// Use promptValue to create your message array (details depend on your API logic)
//      this.messages = await createMessagesFromPrompt( promptValue );                                      //#.(40405.03.2 RAM Assuming a createMessagesFromPrompt function)
        Alert( `Received prompt, '${aPromptValue}', in the MessagesComponent`, this.NoAlert )               // .(40405.05.6).(40405.06.14)
        await this.fetchMessages(   aPromptValue );                                                         // .(40405.03.3 RAM Call the method to fetch data)
        Alert( `Fetched messages for, '${aPromptValue}', in the MessagesComponent`, this.NoAlert )          // .(40405.05.7).(40405.06.15)
        }
//    ---------------------------------------------------------
    render() {
//      const promptValue = getPromptValue();                                                               //#.(40405.03.1 Don't get prompt value here)
//      alert( `Submitting prompt: ${promptValue}`)                                                         //#.(40405.03.1)
 return html`
        <div id="spacer"></div>
        <div id="messages-container">
          ${this.Messages.map( ( message ) => this.renderMessage( message ) ) }
        </div>
        `;
        }
//    ---------------------------------------------------------

    renderMessage( message ) {
//  if (message.role === 'user') { message.message = unsafeHTML( message.message ) }                             //#.(40411.03.5 RAM fmt <br>s)
 return html`
        <div class="message ${ message.role === 'user' ? 'user-message' : 'assistant-message'}">
          ${ message.role === 'user' ? message.message : unsafeHTML( message.message ) }                       <!-- .(40411.03.5 RAM fmt <br>s) -->
        </div>
        `;
        }
//    ---------------------------------------------------------
      }
//  -------------------------------------------------------------------------------

    customElements.define( 'messages-component', MessagesComponent_ );

    export class MessagesComponent extends MessagesComponent_ { }

//  -------------------------------------------------------------------------------

    function Alert( aMsg,  bNoAlert_) {                                             // .(40405.05.1 RAM Beg Write Alert).(40405.06.16)
    var bNoAlert1 = (typeof( bNoAlert )  != 'undefined') ? bNoAlert  : false        // .(40405.06.17 RAM Assign bNoAlert1 not bNoAlert_ )
//      bNoAlert_ = (typeof( bNoAlert  ) != 'undefined') ? bNoAlert  : false        //#.(40405.06.18)
        bNoAlert_ = (typeof( bNoAlert_ ) != 'undefined') ? bNoAlert_ : bNoAlert1    // .(40405.06.19 RAM Set default to bNoAlert1 not false)
        bNoAlert_ = ( bNoAlert_ != -2) ? bNoAlert_ : false                          // .(40405.06.20)
    if (bNoAlert_) { console.log( `    ${ aMsg.trim() }` ) } else { alert( aMsg )}  // .(40405.06.21)
      }                                                                             // .(40405.05.1 RAM End)
//    ---------------------------------------------------------
/*\
##SRCE     +====================+===============================================+
##=========+====================+================================================+
\*/