//var urls=[]
//var startTime;
//var history;
function onOpen() {
  
  var spreadsheet=SpreadsheetApp.getActive();
  var menuItems = [
    {name: 'Fetch Likes/Comments/Shares', functionName: 'logUrl'}
  ];  spreadsheet.addMenu('MyApp', menuItems);
  
  ScriptApp.newTrigger("logUrl")
  .timeBased()
  .everyMinutes(5)
  .create();
  
//  var now = new Date();
//  startTime = now.toLocaleTimeString();
//  var ss = SpreadsheetApp.getActiveSpreadsheet();
//  var viewSheet = ss.getSheetByName('Sheet_name1');
//  viewSheet.getRange('A3').setValue(startTime);
//  Logger.log(startTime); 
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var viewSheet = ss.getSheetByName('Sheet_name1');
  viewSheet.getRange('A2').setValue(1);
}


function logUrl() {
//  var sheet = SpreadsheetApp.getActiveSheet();
//  var data = sheet.getDataRange().getValues();
  var urls=[];
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var viewSheet = ss.getSheetByName('Sheet_name2');
  var data = viewSheet.getDataRange().getValues();
  for (var i =1; i < data.length; i++) {
//    Logger.log('Urls: ' + data[i][3]);
    if(data[i][3]!="")
    {
      urls[i-1]=data[i][3];
    }
  }
  Logger.log(urls.length)
  promptForDate(urls);
}

function promptForDate(urls) {
//  var ui = SpreadsheetApp.getUi();
//  var response = ui.prompt('Please Enter Access Token', ui.ButtonSet.YES_NO);
//  var token=response.getResponseText();
// // Process the user's response.
// if (response.getSelectedButton() == ui.Button.YES) {
//   Logger.log('The user\'s name is %s.', response.getResponseText());
// } else if (response.getSelectedButton() == ui.Button.NO) {
//   Logger.log('The user didn\'t want to provide a name.');
// } else {
//   Logger.log('The user clicked the close button in the dialog\'s title bar.');
// }
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var viewSheet = ss.getSheetByName('Sheet_name1');
  var data = viewSheet.getRange('B1').getValue();
//  Logger.log('Token: ' + data);
  var token=data;
  getIds(token, urls);
}

  
//function testSocialShares() {
//  var pageId_postId="1327038517331134_1881299501905030";
//  var accessToken = "EAAGKRLDmUpIBAFISQzcDCYR9iZCtFsU9oI8YLRJhhXhaObZCogKANjPcHJMX4Y5PBhVZBLTXn3FL5fTQFOvicHZCXrKyHZB5N4nr1c4gXlOdxgJqk0762Q6VCKqr6qYfpKwLLnvzLDFLMNqON8ahzpYEI19zTQIUNQVLMeTWutQZDZD";
//  getSocialCounts(pageId_postId,accessToken);
//}


function getIds(accessToken, urls)
{
  var nows = new Date();
  startTime = nows.toLocaleTimeString();
  var sss = SpreadsheetApp.getActiveSpreadsheet();
  var viewSheets = sss.getSheetByName('Sheet_name1');
  viewSheets.getRange('A3').setValue(startTime);
//  Logger.log(startTime); 
  
  var json;
  var arr=[];
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var viewSheet = ss.getSheetByName('Sheet_name1');
  var history = viewSheet.getRange('A2').getValue();
//  Logger.log(history);
//  Logger.log(urls.length);
//  Logger.log("Inside Out");
  var j=history;
//  Logger.log(j);
  
  while(j<urls.length)
  {
    var url = urls[j];
//    Logger.log(url);
    var res = url.split("/");
//    Logger.log(res);
    if(res[2]=="www.facebook.com" || res[2]=="business.facebook.com")
    {
      var postid;
      var l = ['photos', 'videos', 'posts'];
      for(i in res)
      {
//        Logger.log(res[i])
        if(l.indexOf(res[i]) > -1)
        {
//          Logger.log(res[i]);
//          Logger.log("Yes");
          var x=res[i]+"/";
          var initial=url.split(x);
//          Logger.log(initial);
          var slash = initial[1].split("/")
          initial[1] = slash[0];
//          Logger.log(initial[1]);
          if(res[i]!="photos")
          {
            postid=initial[1];
          }
          else
          {
            postid=res[6];
          }
//          Logger.log(postid);
          //      var z=initial[0]+res[i];
          //      Logger.log(z);
          break;
        }
        
      }
      try{
        var json_page=UrlFetchApp.fetch("https://graph.facebook.com/"+res[3]+"?&access_token="+accessToken);
        var response_page = Utilities.jsonParse(json_page.getContentText());
        var page_id = response_page.id;
      }
      catch(err)
      {
        Logger.log("UrlfetchERROR")
      }
//      Logger.log(page_id);
      getCounts(page_id,postid,accessToken,(j+2));
    }
//    Logger.log(j);
    if(j==urls.length-1)
    {
      var triggers = ScriptApp.getProjectTriggers();
      for (var i = 0; i < triggers.length; i++) {
        ScriptApp.deleteTrigger(triggers[i]);
      } 
    }
    var now = new Date();
    var currentTime = now.toLocaleTimeString();
    var s1 = SpreadsheetApp.getActiveSpreadsheet();
    var viewSheet1 = s1.getSheetByName('Sheet_name1');
    var startTime = viewSheet1.getRange("A3").getValue();
    var diff = currentTime.split(":")[1] - startTime.split(":")[1];
    if(diff<0)
    {
      diff=diff+60;
    }
    if(diff>=4)
    {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var viewSheet = ss.getSheetByName('Sheet_name1');
      viewSheet.getRange('A2').setValue(j);
      break;
    }

    j=j+1;
  }
}

function getCounts(page_id,postid,accessToken,index)
{
  var pageId_postId=page_id+"_"+postid;
  try
  {
    json = UrlFetchApp.fetch("https://graph.facebook.com/"+pageId_postId+"?fields=comments.limit(0).summary(true),reactions.limit(0).summary(true),shares.limit(0).summary(true)&access_token="+accessToken);
//    Logger.log(json);
    var response = Utilities.jsonParse(json.getContentText());
    //  Logger.log(response.comments.summary.total_count);
    //  Logger.log(response.reactions.summary.total_count);
    //  Logger.log(response.shares.count);
    var x=y=z=0;
    x=response.comments.summary.total_count;
    y=response.reactions.summary.total_count;
    if(response.shares)
    {
      z=response.shares.count;
    }
    else
    {
      z=0;
    }
    
    arr=[x,y,z];
//    Logger.log(arr);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var viewSheet = ss.getSheetByName('Sheet_name2');
    //  var sheet=SpreadsheetApp.getActiveSheet();
    var posc='I'+index;
    var posr='J'+index;
    var poss='K'+index;
    viewSheet.getRange(posc).setValue(arr[0]);
    viewSheet.getRange(posr).setValue(arr[1]);
    viewSheet.getRange(poss).setValue(arr[2]);
    //  Logger.log("Facebook Likes :: " + response.likes);
  }
  catch(error)
  {
    Logger.log("*");
  }
}
