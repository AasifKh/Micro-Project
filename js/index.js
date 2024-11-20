/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var studDBName = "schooldb";
var studRelationName = "studenttable";
var connToken = "90934433|-31949228937661577|90956915";

function validateData(){
    var studId,studName,studClass,studDate,studAdd,studEnr;
    studId=$("#studId").val();
    studName=$("#studName").val();
    studClass=$("#studClass").val();
    studDate=$("#studDate").val();
    studAdd=$("#studAdd").val();
    studEnr=$("#studEnr").val();
    
    if(studId === ""){
        alert("Student Id is missing.");
        $("#studId").focus();
        return "";
    }
    if(studName === ""){
        alert("Student Name is missing.");
        $("#studName").focus();
        return "";
    }
    if(studClass === ""){
        alert("Student Class is missing.");
        $("#studClass").focus();
        return "";
    }
    if(studDate === ""){
        alert("Student Date is missing.");
        $("#studDate").focus();
        return "";
    }
    if(studAdd === ""){
        alert("Student Address is missing.");
        $("#studAdd").focus();
        return "";
    }
    if(studEnr === ""){
        alert("Student Enrollment date is missing.");
        $("#studEnr").focus();
        return "";
    }
    
    var jsonStrObj={
        studId:studId,
        studName:studName,
        studClass:studClass,
        studDate:studDate,
        studAdd:studAdd,
        studEnr:studEnr
    };
    return JSON.stringify(jsonStrObj);
}


function saveRecNo2LS(jsonObj){
    var lvData=JSON.parse(jsonObj.data).record;
    localStorage.setItem("recno",lvData.rec_no);
}


function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $("#studName").val(data.studName);
    $("#studClass").val(data.studClass);
    $("#studDate").val(data.studDate);
    $("#studAdd").val(data.studAdd);
    $("#studEnr").val(data.studEnr);
}


function getStudIdAsJsonObj(){
    var studId = $("#studId").val();
    var jsonStr = {
        studId:studId
    };
    return JSON.stringify(jsonStr);
}

function getStud(){
  
    var studIdJsonObj = getStudIdAsJsonObj();
    console.log(studIdJsonObj);
    var getRequest = createGET_BY_KEYRequest(connToken,studDBName,studRelationName,studIdJsonObj);
    console.log(getRequest);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest,jpdbBaseURL,jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status===400) {
        // Record does not exist
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#studName").focus();
    } else if (resJsonObj.status === 200) {
        // Record exists
        $("#studId").prop("disabled", true);
        fillData(resJsonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#studName").focus();
    }
}

function updateData(){
    var recno = localStorage.getItem("recno");
    if (!recno) {
        alert("Record number is missing. Please fetch the record first.");
        return;
    }
    $("#change").prop("disabled",true);
    var jsonChg = validateData();
    var updateRequest =  createUPDATERecordRequest(connToken,jsonChg,studDBName,studRelationName,recno);
   // console.log(updateRequest);
   console.log("Generated Update Request:", updateRequest);
    jQuery.ajaxSetup({async: false}); 
   // var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML); 
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async: true}); 
    console.log(resJsonObj);
    resetForm();
    $("#studId").focus();
}
function resetForm(){
    $("#studId").val("");
    $("#studName").val("");
    $("#studClass").val("");
    $("#studDate").val("");
    $("#studAdd").val("");
    $("#studEnr").val("");
    $("#studId").prop("disabled",false);
    $("#save").prop("disabled",true);
    $("#change").prop("disabled",true);
    $("#reset").prop("disabled",true);
    $("#studId").focus();
}

function saveData(){
    var jsonStrObj = validateData();
    if(jsonStrObj === ""){
        return "";
    }
    var putRequest = createPUTRequest(connToken,jsonStrObj,studDBName,studRelationName);
    console.log(putRequest);
    jQuery.ajaxSetup({async: false}); 
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest,jpdbBaseURL,jpdbIML); 
    jQuery.ajaxSetup({async: true}); 
    console.log(resJsonObj);
    resetForm();
    $("#studId").focus();
}
