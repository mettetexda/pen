var userType = 0;
var SERVER_URL = "";

var m_bAllowDrawingWhenMinimize = false;
var IS_IOS_EXTENSION = false;
var uUserLoginType = 2;
var bInitialized = false;
/**
 * Callback for adding two numbers.
 *
 * @callback responseHandler
 * @param {Object} message - An object.
 */

/**
 * @param {Object} msg
 * @param {responseHandler} callback 
 */
 function SendPopupMessageToBackground(msg, callback)
 {
    chrome.runtime.sendMessage(msg, callback);
 }


function HandleInitResponse(message)
{
    if(message.type == "AnnotateLoginResponsePlugin")
    {
        $("#loadingcard").hide();
        var response = message.data;
        SERVER_URL = message.serverUrl;
        IS_IOS_EXTENSION = message.isIOSExtension;
        if(response && response.name) {
            uUserLoginType = response.uUserType;
            $("#notloggedincard").hide();
            $("#loggedincard").show();
            $("#name").text(response.name);
            $('#name').prop('title', response.name);
            $("#email").text(response.strUserName);
            $('#email').prop('title', response.strUserName);
            $('#profile').css("background-image", "url(" + response.strUserPicture + ")");
            if(response.oUserPicturePosition){
                var scale = 36 / response.oUserPicturePosition.w;
                var left = 0 - response.oUserPicturePosition.x * scale;
                var top = 0 - response.oUserPicturePosition.y * scale;
                $('#profile').css("background-position", left + "px " + top + "px");
                var tmpImg = new Image();
                tmpImg.onload = function() {
                    var backgroundWidth = tmpImg.width * scale;
                    var backgroundHeight = tmpImg.height * scale;
                    $('#profile').css("background-size", (backgroundWidth) + "px " + (backgroundHeight) + "px");
                };
                tmpImg.src = response.strUserPicture;
            }
            else{
                $('#profile').css("background-position", "0px 0px");
                $('#profile').css("background-size", "100%");
            }

            if(response.bUserType == 1) {
                userType = 1;
                $("#upgrade").show();                        
                //   $("#capture-tab").addClass("disabled");
                $("#highlight-state-container").addClass("disabled");
                //   $("#annotation-mode").addClass("disabled");
                //   $("#annotation-mode").css("user-select", "none");
                //   $("#annotationbtn").prop("disabled", "true");
            }
            else {
                userType = 0;
                $("#upgrade").hide();
                //   $("#capture-tab").removeClass("disabled");
                $("#highlight-state-container").removeClass("disabled");
                //   $("#annotation-mode").removeClass("disabled");
                $("#annotation-mode").css("user-select", "auto");
                $("#annotationbtn").prop("disabled", "false");
            }

            if(response.uUserType == 4){
                $("#annotation-mode").addClass("disabled");
                $("#minimize-mode").addClass("disabled");
                            $("#minimize-mode-drawing").addClass("disabled");

                $("#annotation-mode").css("pointer-events", "none");
                $("#minimize-mode").css("pointer-events", "none");
                            $("#minimize-mode-drawing").css("pointer-events", "none");
            }
            else {
                $("#annotation-mode").removeClass("disabled");
                $("#minimize-mode").removeClass("disabled");
                            $("#minimize-mode-drawing").removeClass("disabled");

                $("#annotation-mode").css("pointer-events", "auto");
                $("#minimize-mode").css("pointer-events", "auto");
                            $("#minimize-mode-drawing").css("pointer-events", "auto");
            }
        }
        else {
            $("#loggedincard").hide();
            $("#notloggedincard").show();
        }

        $("#extension-version").text("v" + chrome.runtime.getManifest()['version']);
        
        $("#annotationbtn").prop('checked', message.bAnnotationMode ? true : false);
        $("#minimizeModebtn").prop('checked', message.bHideWhenMinimize ? true : false);
        if(message.bHideWhenMinimize){
            $("#minimizeModeDrawingbtn").prop('checked', false);
            $("#minimize-mode-drawing-switch").addClass('disabled');
        }
        else{
            $("#minimizeModeDrawingbtn").prop('checked', message.bAllowDrawingWhenMinimize ? true : false);
            $("#minimize-mode-drawing-switch").removeClass('disabled');
        }
        m_bAllowDrawingWhenMinimize = message.bAllowDrawingWhenMinimize;
        $("#highlightbtn").prop('checked', message.bShowHighlight ? true : false);
        $("#stylusPenbtn").prop('checked', message.bStylusMode ? true : false);
        if(message.bAnnotationMode) 
        {
            $("#highlight-state-container").addClass('disabled');
        }
        else
        {
            $("#highlight-state-container").removeClass('disabled');
        }

        if(message.bStylusModeAsked && !response["ChromeClientLogin"]) 
        {
            $("#stylus-pen-mode").show();
        }
        else
        {
            $("#stylus-pen-mode").hide();
        }

        if(response && response["ChromeClientLogin"]){
            $("#ccl-logged-in-message").show();
            $("#annotation-mode").hide();
            $("#minimize-mode").hide();
            $("#minimize-mode-drawing").hide();
        }else{
            $("#ccl-logged-in-message").hide();
            $("#annotation-mode").show();
            $("#minimize-mode").show();
            $("#minimize-mode-drawing").show();
        }

        return true;
    }
    return false;
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if(HandleInitResponse(message)) {
        return;
    } else if(message.type == "AnnotateClosePopup"){
        window.close();
    }
    sendResponse({"received": true});
    return false;
})

$(document).ready(function(){
    setTimeout(function(){

        SendPopupMessageToBackground({
            type:"annotateInitPopup"
        },function (message) {
            HandleInitResponse(message);
        });
    }, 0);

    $("#annotation-mode").click(function() {
        if(uUserLoginType == 4)
            return

        if($('#annotationbtn').prop('checked')) {
            $("#annotationbtn").prop('checked', false);
            var message = {"type": "annotateAnnotationModeGot", "value": false};
            SendPopupMessageToBackground(message, null);        
        }
        else {
            $("#annotationbtn").prop('checked', true);
            var message = {"type": "annotateAnnotationModeGot", "value": true};
            SendPopupMessageToBackground(message, null);                 
        }            
        window.close();
      
    }); 

    $("#minimize-mode").click(function() {
        if(uUserLoginType == 4)
            return
        if($('#minimizeModebtn').prop('checked')) {
            $("#minimizeModebtn").prop('checked', false);
            $("#minimizeModeDrawingbtn").prop('checked', m_bAllowDrawingWhenMinimize ? true : false);
            $("#minimize-mode-drawing-switch").removeClass('disabled');
            var message = {"type": "annotateMinimizeModeUpdated", "value": false};
            SendPopupMessageToBackground(message, null);        
        }
        else {
            $("#minimizeModebtn").prop('checked', true);
            $("#minimizeModeDrawingbtn").prop('checked', false);
            $("#minimize-mode-drawing-switch").addClass('disabled');
            var message = {"type": "annotateMinimizeModeUpdated", "value": true};
            SendPopupMessageToBackground(message, null);                 
        }            
        window.close();
    }); 

    $("#minimize-mode-drawing").click(function() {
        if($("#minimize-mode-drawing-switch").hasClass('disabled') || $("#minimize-mode-drawing").hasClass('disabled'))
            return;

        if($('#minimizeModeDrawingbtn').prop('checked')) {
            $("#minimizeModeDrawingbtn").prop('checked', false);
            var message = {"type": "annotateAllowMinimizeModeDrawingUpdated", "value": false};
            SendPopupMessageToBackground(message, null);        
        }
        else {
            $("#minimizeModeDrawingbtn").prop('checked', true);
            var message = {"type": "annotateAllowMinimizeModeDrawingUpdated", "value": true};
            SendPopupMessageToBackground(message, null);                 
        }            
        window.close();
    });

    $("#minimize-mode-drawing-switch").click(function(e) {
        if($("#minimize-mode-drawing-switch").hasClass('disabled'))
            e.preventDefault();

    });

    $("#stylus-pen-mode").click(function() {
        if($('#stylusPenbtn').prop('checked')) {
            $("#stylusPenbtn").prop('checked', false);
            var message = {"type": "annotateStylusModeUpdated", "value": false};
            SendPopupMessageToBackground(message, null);        
        }
        else {
            $("#stylusPenbtn").prop('checked', true);
            var message = {"type": "annotateStylusModeUpdated", "value": true};
            SendPopupMessageToBackground(message, null);                 
        }            
        window.close();
    }); 

    $("#highlight-state-container").click(function() {
        if(userType == 0) {
            if($('#highlightbtn').prop('checked')) {
                $("#highlightbtn").prop('checked', false);
                var message = {"type": "annotateHighlightModeChanged", "value": false};
                SendPopupMessageToBackground(message, null);        
            }
            else {
                $("#highlightbtn").prop('checked', true);
                var message = {"type": "annotateHighlightModeChanged", "value": true};
                SendPopupMessageToBackground(message, null); 
            }
        }
    });

    $('body').on('click', 'a', function(){
        chrome.tabs.create({url: $(this).attr('href')});
        return false;
    });

    $('#logout-icon').click(function() {
        $("#loggedincard").hide();
        $("#logoutConfirmantion").show();
    });

    $('#upgrade').click(function() {
        if(IS_IOS_EXTENSION)
        {
            chrome.tabs.create({
                active: true, 
                url: "annotatenet://" + "upgrade"
            }, function (response) {});
        }
        else{
            chrome.tabs.create({url: SERVER_URL + "/login.php?continue=upgrade" });
        }
        return false;
    });

    $('#btnLogoutCancel').click(function() {
        $("#logoutConfirmantion").hide();
        $("#loggedincard").show();
    });

    $('#btnLogoutOk').click(function() {
        chrome.tabs.query({url : SERVER_URL + "/*"},  function(tabArray) {          
            
            if(tabArray.length > 0)
            {
                for(var i = 0; i < tabArray.length; i++)
                {
                    if(tabArray[i].url.startsWith(SERVER_URL + "/instructor") 
                    || tabArray[i].url.startsWith(SERVER_URL + "/student")
                    )
                    {
                        var tab = tabArray[i];
                        
                        if(chrome.windows && chrome.windows.update)
                            chrome.windows.update(tab.windowId, {focused: true});
                        
                        chrome.tabs.update(tab.id, {active: true, 
                            url: SERVER_URL + "/logout.php"});
                        
                        window.close();
                        return;
                    }
                }                
            }
                        
            chrome.tabs.create({
                active: true, 
                url: SERVER_URL + "/logout.php"
            }, function (response) {});
            
        });
    });
    
    $('#name').click(function() {
        chrome.tabs.query({url : SERVER_URL + "/*"},  function(tabArray) {          
            
            if(tabArray.length > 0)
            {
                for(var i = 0; i < tabArray.length; i++)
                {
                    if(tabArray[i].url.startsWith(SERVER_URL + "/instructor") 
                    || tabArray[i].url.startsWith(SERVER_URL + "/student")
                    )
                    {
                        var tab = tabArray[i];
                        if(chrome.windows && chrome.windows.update)
                            chrome.windows.update(tab.windowId, {focused: true});
                        chrome.tabs.update(tab.id, {active: true});
                        window.close();
                        return;
                    }
                }
                
            }
            
            chrome.tabs.create({
                active: true, 
                url: SERVER_URL + "/login.php"
            }, function (response) {});
            
        });
    });

    $('#btn-sign-in').click(function() {

        /*if(IS_IOS_EXTENSION)
        {
            chrome.tabs.create({
                active: true, 
                url: "annotatenet://" + "login"
            }, function (response) {});
        }
        else{*/
            chrome.tabs.query({url : SERVER_URL + "/login.php*"},  function(tabArray) {          
                
                if(tabArray.length > 0)
                {
                    for(var i = 0; i < tabArray.length; i++)
                    {
                        var tab = tabArray[i];
                    if(tabArray[i].url.startsWith(SERVER_URL + "/login.php"))
                    {
                        if(chrome.windows && chrome.windows.update)
                            chrome.windows.update(tab.windowId, {focused: true});
                        
                        chrome.tabs.update(tab.id, {active: true});

                        window.close();

                        return;                    
                    }                
                }
            }
                
                chrome.tabs.create({
                    active: true, 
                    url: SERVER_URL + "/login.php"
                }, function (response) {});
                
            });
        //}
    });

    $('#btn-sign-up').click(function() {
        chrome.tabs.query({url : SERVER_URL + "/free-signup*"},  function(tabArray) {          
            
            if(tabArray.length > 0)
            {
                for(var i = 0; i < tabArray.length; i++)
                {
                    var tab = tabArray[i];
                    if(tabArray[i].url.startsWith(SERVER_URL + "/free-signup"))
                    {
                        if(chrome.windows && chrome.windows.update)
                            chrome.windows.update(tab.windowId, {focused: true});
                        
                        chrome.tabs.update(tab.id, {active: true});

                        window.close();
                        return;
                    }
                }
            }
            
            chrome.tabs.create({
                active: true, 
                url: SERVER_URL + "/free-signup"
            }, function (response) {});            
        });
    });
});