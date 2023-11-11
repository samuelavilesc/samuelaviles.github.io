function MCD(a, b){
    if(b===0){
        return a;
    }
    return MCD(b, a % b);
}
function MCM(a, b){
    return (a * b) / MCD(a, b);
}
function calcular(){
let num1=document.getElementById("num1").value;
let num2=document.getElementById("num2").value;
let eleccion=document.getElementById("selector").value;
if(eleccion=="mcd"){
    document.getElementById("resultado").innerHTML=MCD(num1,num2);
}
else{
    document.getElementById("resultado").innerHTML=MCM(num1,num2);
}
}