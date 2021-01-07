
const url= `ws://localhost:9876/websocket`
const socket = new WebSocket(url)
 
const btnStudent = document.getElementById('btnStudent')
const btnTeacher = document.getElementById('btnTeacher')
const registerDiv = document.getElementById('register')
const showDataDiv = document.getElementById('showData')
const stuTable =document.getElementById('stuTable')
var teacherAuth = document.getElementById('auth')
var username =document.getElementById('username')
var password = document.getElementById('password')
  /* Student related elements */
 
  const stuReg = document.getElementById('stuReg')
  const msg = document.getElementById('msg')
  const stuMsg = document.getElementById('input_text')
  var rollNo = document.getElementById('rollNo')

function showStudentData(){
  stuReg.style.display="block"
  registerDiv.style.display="none"
}

function showTeacherData(){
  teacherAuth.style.display="block"
  registerDiv.style.display="none"
  }

function btnSubmit(){
  if(username.value=='admin' && password.value=='admin'){
    teacherAuth.style.display="none"
    showDataDiv.style.display="block"
}
}

/* rollno, wordcount, char count and words per minute have to be sent to web socket server */


var wordCount, charCount, wpmCount=0, stuRollNo,obj;

/* Hiding roll no textfield and displaying textarea in which text is to be typed */
function hideDiv(){
   rollNo = rollNo.value; 
    stuReg.style.display = "none";
    msg.style.display= "block";    
}

var flag =1;
 function countWords(){
  
  var str = stuMsg.value;
  /* Counting no. of Words */
  var words = str;
  words.replace(/(^\s*)|(\s*$)/gi,"");
  words = words.replace(/[ ]{2,}/gi," ");
  words = words.replace(/\n /,"\n");
  var wCount = words.split(' ').length;
  //console.log('Word Count: '+ wordCount)
 
  /* Counting no. of characters , length = no. of characters */
       var charCount = str.replace(/ /g, "");
 // get the length of the string after removal
    var length = charCount.length;
    
  // storing wordcount and charcount in global variables
    wordCount = wCount;
    charCount =length;
 //console.log('Char count:'+charCount)

 /*  words per minute */
  wordsPerMin()
// , WpmCount: wpmCount , roll no (undefined)
obj = { RollNo: rollNo, CharCount: charCount, WordCount: wordCount , WpmCount:wpmCount };

console.log(obj);
//socket.send(obj)
//var myJSON = JSON.stringify(obj);
//socket.send(myJSON)

  // save the database to firebase working
   var database = firebase.database();//gets the databse
   var ref = database.ref('StudentRecords/'+rollNo);
   //pushing object to the database
   if(flag ==1){ref.push(obj);
   flag=0;
  } 

   //Updating Data
   if(flag ==0){
   firebase.database().ref('StudentRecords/'+rollNo).update({
    RollNo :rollNo, 
    WordCount: wordCount,
     CharCount: charCount,
     WpmCount: wpmCount
   })
  }
  } 

  /* Counting the no of words and characters every time something is added to textarea */

   /* Implementing Words Per Minute */
   let startTime = null;
   function wordsPerMin(){
      var keyspressed = 0;
      if(startTime === null)
      {
        startTime = performance.now();
      }
      else
      {
        keyspressed++;
        wordswritten = keyspressed / 5.1;
        wpmCount=calculateWpm(startTime, performance.now(), wordswritten);
       //console.log(wpmCount)
      
   }};
    
    function calculateWpm(startTimeMs, currentTimeMs, totalWords) {
      const mins = ((currentTimeMs - startTimeMs) / 1000) / 60;
      return (totalWords / mins).toFixed(2);
    }
 
    socket.onopen = function(event){
      console.log('On Open Called')
      socket.send(obj)
      
    }
    
 
    // Handle any errors that occur.
  socket.onerror = function(error) {
    console.log('WebSocket Error: ' + error);
  }

  
/* Creating table in which student data is to be displayed*/
  function addItemsToTable(rollNo, words, chars, wordsPM){
    
    var tbl = document.getElementById('stuTable')
    var tblBody = document.createElement("tbody")
    var row = document.createElement('tr')
    var _rollNo = document.createElement('td')
    var _words = document.createElement('td')
    var _chars = document.createElement('td')
    var _wordsPM = document.createElement('td')

    _rollNo.innerHTML =rollNo;
    _words.innerHTML= words;
    _chars.innerHTML =chars;
    _wordsPM.innerHTML =wordsPM;

    row.appendChild(_rollNo)
    row.appendChild(_words)
    row.appendChild(_chars)
    row.appendChild(_wordsPM)

    tblBody.appendChild(row)
    tbl.appendChild(tblBody)
  }
 
  /* Fetching data from firebase  realtime database */
  function fetchAllData(){
    firebase.database().ref('StudentRecords').orderByChild('WpmCount')
    .once('value', function(snapshot){
      snapshot.forEach(
        function(childSnapshot){
          let rollno = childSnapshot.val().RollNo;
          let wc = childSnapshot.val().WordCount;
          let cc = childSnapshot.val().CharCount;
          let wpmc = childSnapshot.val().WpmCount;
          addItemsToTable(rollno,wc,cc,wpmc)
        }
      )
    })
  }
  

window.onload=fetchAllData()
